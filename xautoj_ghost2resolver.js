const fs = require('fs');
const path = require('path');

frozen_seconds = 60 * 60

const ghost = fs.readFileSync(path.resolve(__dirname, 'contest.ghost'), 'utf8');
const data = {};
const lines = ghost.split('\n');
data.contest_name = lines[0].split('"')[1].split('"')[0];
data.problem_count = parseInt(lines[2].split(' ')[1]);
data.frozen_seconds = 3600*2
data.teams = parseInt(lines[3].split(' ')[1]);
data.submissions = parseInt(lines[4].split(' ')[1]);
data.users = {};
for (let i = 5+data.problem_count; i< 5+data.problem_count+data.teams; i++) {
    const team = lines[i].match(/@t (\d+),\d+,\d+,(.*)/);
    data.users[team[1]] = {
        name: team[2].split('-')[1],
        college: team[2].split('-')[0],
        is_exclude: false
    }
}
data.solutions = {}
for (let i = 5+data.problem_count+data.teams; i<5+data.problem_count+data.teams+data.submissions; i++) {
    //@s 3,C,1,10066,AC
    const line = lines[i].split(' ')[1].split(',');
    data.solutions[i] = {
        user_id: line[0],
        problem_index: parseInt(line[1].charCodeAt(0) - 'A'.charCodeAt(0)) + 1,
        verdict: line[4],
        submitted_seconds: parseInt(line[3])
    }
}
// sort by submitted_seconds
const s = Object.keys(data.solutions).map(key => data.solutions[key]);
s.sort((a, b) => a.submitted_seconds - b.submitted_seconds);
data.solutions = {};
s.forEach((solution, index) => {
    data.solutions[index] = solution;
});
fs.writeFileSync(path.resolve(__dirname, 'contest.json'), JSON.stringify(data, null, 4));

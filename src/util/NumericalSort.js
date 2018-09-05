export default function numericalSort(keys, entities, column) {
  const zeroVoteCounties = keys.slice().filter(key => !entities[key].results[column]);
  const countiesWithVotes = keys.slice().filter(key => entities[key].results[column]);
  const sortedCounties = countiesWithVotes.sort((a, b) => entities[b].results[column] - entities[a].results[column]);
  return sortedCounties.concat(zeroVoteCounties);
}

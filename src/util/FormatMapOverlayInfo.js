const formatMapOverlayInfo = (feature, isNational) => ({
  geographyName: feature.properties.NAME,
  winnerName: feature.properties.winner_name,
  winnerParty: feature.properties.winner_party,
  winnerMargin: feature.properties.winner_margin,
  winnerVotes: feature.properties.winner_votes,
  secondName: feature.properties.second_name,
  secondParty: feature.properties.second_party,
  secondMargin: feature.properties.second_margin,
  secondVotes: feature.properties.second_votes,
  layer: feature.layer.source,
  isNational,
});

export default formatMapOverlayInfo;

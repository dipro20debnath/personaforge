// 20-item mini IPIP (public domain) — 4 items per Big Five trait
export const IPIP_QUESTIONS = [
  // Extraversion
  { id:'q1',  text:'I am the life of the party.',                    trait:'extraversion', reverse:false },
  { id:'q2',  text:"I don't talk a lot.",                            trait:'extraversion', reverse:true },
  { id:'q3',  text:'I talk to a lot of different people at parties.', trait:'extraversion', reverse:false },
  { id:'q4',  text:'I keep in the background.',                      trait:'extraversion', reverse:true },

  // Agreeableness
  { id:'q5',  text:'I sympathize with others\' feelings.',           trait:'agreeableness', reverse:false },
  { id:'q6',  text:'I am not interested in other people\'s problems.', trait:'agreeableness', reverse:true },
  { id:'q7',  text:'I feel others\' emotions.',                      trait:'agreeableness', reverse:false },
  { id:'q8',  text:'I am not really interested in others.',           trait:'agreeableness', reverse:true },

  // Conscientiousness
  { id:'q9',  text:'I get chores done right away.',                  trait:'conscientiousness', reverse:false },
  { id:'q10', text:'I often forget to put things back in their proper place.', trait:'conscientiousness', reverse:true },
  { id:'q11', text:'I like order.',                                  trait:'conscientiousness', reverse:false },
  { id:'q12', text:'I make a mess of things.',                       trait:'conscientiousness', reverse:true },

  // Neuroticism
  { id:'q13', text:'I have frequent mood swings.',                   trait:'neuroticism', reverse:false },
  { id:'q14', text:'I am relaxed most of the time.',                 trait:'neuroticism', reverse:true },
  { id:'q15', text:'I get upset easily.',                            trait:'neuroticism', reverse:false },
  { id:'q16', text:'I seldom feel blue.',                            trait:'neuroticism', reverse:true },

  // Openness
  { id:'q17', text:'I have a vivid imagination.',                    trait:'openness', reverse:false },
  { id:'q18', text:'I am not interested in abstract ideas.',         trait:'openness', reverse:true },
  { id:'q19', text:'I have difficulty understanding abstract ideas.', trait:'openness', reverse:true },
  { id:'q20', text:'I have a rich vocabulary.',                      trait:'openness', reverse:false },
];

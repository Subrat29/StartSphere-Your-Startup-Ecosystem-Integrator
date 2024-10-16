const Profile = require("../../Models/Profile");
const natural = require("natural");

const calculateSimilarity = (text1, text2) => {
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(text1);
  tfidf.addDocument(text2);

  const vector1 = tfidf.listTerms(0).map(term => term.tfidf);
  const vector2 = tfidf.listTerms(1).map(term => term.tfidf);

  const dotProduct = vector1.reduce((sum, value, index) => sum + value * (vector2[index] || 0), 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, value) => sum + value * value, 0));
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
};

const matchProfiles = async (userId) => {
  try {
    const userProfile = await Profile.findById(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const allProfiles = await Profile.find({ _id: { $ne: userId, $nin: userProfile.MyMentors } });

    const similarities = allProfiles.map(profile => {
      const bioSimilarity = calculateSimilarity(userProfile.Bio || '', profile.Bio || '');
      const roleSimilarity = calculateSimilarity(userProfile.Role || '', profile.Role || '');
      const totalSimilarity = bioSimilarity + roleSimilarity;

      return { profile, totalSimilarity };
    });

    similarities.sort((a, b) => b.totalSimilarity - a.totalSimilarity);
    return similarities.slice(0, 10).map(item => item.profile);
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports = { matchProfiles };

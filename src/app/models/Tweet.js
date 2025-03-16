import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true, 
    maxlength: 280 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  image: String,
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  retweets: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tweet' 
  }]
}, {
  timestamps: true
});

export default mongoose.models.Tweet || mongoose.model('Tweet', tweetSchema);
module.exports = {

  db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/dev_',

  sessionSecret: process.env.SESSION_SECRET || 'change this',

  mailgun: {
    user: process.env.MAILGUN_SMTP_LOGIN|| '',
    password: process.env.MAILGUN_SMTP_PASSWORD || ''
  },

  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || '',
    stripePubKey: process.env.STRIPE_PUB_KEY || '',
    defaultPlan: 'free',
    plans: ['free', 'monthly', 'yearly'],
    planData: {
      'free': {
        name: 'Free',
        price: 0
      },
      'monthly': {
        name: 'Monthly',
        price: 9.99
      },
      'yearly': {
        name: 'Yearly',
        price: 119.99
      }
    }
  },

  googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};

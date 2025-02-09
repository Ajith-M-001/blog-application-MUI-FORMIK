import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planDetails: {
      name: {
        type: String,
        required: true,
        enum: [
          "free",
          "basic",
          "premium",
          "professional",
          "corporate",
          "trial",
        ],
        default: "free",
      },
      price: {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          required: true,
          enum: ["USD", "INR"],
          default: "INR",
        },
      },
      interval: {
        type: String,
        required: true,
        enum: ["monthly", "yearly"],
        default: "monthly",
      },
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "suspended", "trial", "pending"],
      default: "pending",
      index: true,
    },
    dates: {
      start: {
        type: Date,
        required: true,
        default: Date.now,
      },
      end: {
        type: Date,
        required: true,
      },
      trialEnd: {
        type: Date,
      },
      cancelledAt: {
        type: Date,
      },
      lastBillingDate: {
        type: Date,
      },
      nextBillingDate: {
        type: Date,
      },
    },
    billing: {
      autoRenew: {
        type: Boolean,
        default: true,
      },
      gateway: {
        type: String,
        enum: ["stripe", "paypal", "razorpay"],
        required: true,
      },
      gatewaySubscriptionId: {
        type: String,
        required: true,
      },
      lastFourDigits: {
        type: String,
      },
      failedPayments: {
        type: Number,
        default: 0,
      },
    },
    promotion: {
      code: {
        type: String,
      },
      discount: {
        type: Number,
      },
      validUntil: {
        type: Date,
      },
    },
    cancelReason: {
      type: String,
      enum: [
        "cost",
        "features",
        "usability",
        "support",
        "competition",
        "other",
      ],
    },
    metadata: {
      ip: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      location: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;

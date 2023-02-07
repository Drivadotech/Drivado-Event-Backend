const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userPermissionSchema = new mongoose.Schema({
  newBooking: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "ENABLE",
    },
    performSearch: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE"],
        default: "ENABLE",
      },
    },
    MakeBooking: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE"],
        default: "ENABLE",
      },
    },
  },

  manageBooking: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "ENABLE",
    },
    viewBooking: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "ENABLE",
      },
    },
    cancelBooking: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "ENABLE",
      },
    },
    assignAffiliate: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "DISABLE",
      },
    },
    assignDriver: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "DISABLE",
      },
    },
    markAsPaid: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "DISABLE",
      },
    },
    sms_Document: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "ENABLE",
      },
    },
  },

  affiliate: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },

  regions: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },
  generalSettings: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },
  userManagement: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "ENABLE",
    },
    view: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "ENABLE",
      },
    },
    edit: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "ENABLE",
      },
    },
    addUsers: {
      permission: {
        type: String,
        enum: ["DISABLE", "ENABLE", "BRANCH_LEVEL", "CHILD_COMPANY"],
        default: "DISABLE",
      },
    },
  },
  vehicleTypes: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },
  imageUploader: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },
  apiDocs: {
    permission: {
      type: String,
      enum: ["DISABLE", "READ_ONLY", "ENABLE"],
      default: "DISABLE",
    },
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("userPermission", userPermissionSchema);

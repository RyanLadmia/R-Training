
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  password: 'password',
  profilePicture: 'profilePicture',
  birthDate: 'birthDate',
  phoneNumber: 'phoneNumber',
  emailVerificationToken: 'emailVerificationToken',
  isVerified: 'isVerified',
  resetPasswordToken: 'resetPasswordToken',
  resetPasswordExpire: 'resetPasswordExpire',
  themeId: 'themeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isActive: 'isActive'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.ThemeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.DistrictScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.PostalCodeScalarFieldEnum = {
  id: 'id',
  code: 'code',
  districtId: 'districtId'
};

exports.Prisma.CityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  postalCodeId: 'postalCodeId'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  name: 'name',
  complement: 'complement',
  cityId: 'cityId'
};

exports.Prisma.UserAddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  addressId: 'addressId',
  isDefault: 'isDefault'
};

exports.Prisma.ProgramScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  day_of_week: 'day_of_week',
  createdAt: 'createdAt'
};

exports.Prisma.ProgramSessionScalarFieldEnum = {
  id: 'id',
  programId: 'programId',
  sessionId: 'sessionId',
  order: 'order'
};

exports.Prisma.CustomExerciseScalarFieldEnum = {
  id: 'id',
  trainerId: 'trainerId',
  name: 'name',
  description: 'description',
  muscle_group: 'muscle_group',
  image_url: 'image_url'
};

exports.Prisma.SessionExerciseScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  customExerciseId: 'customExerciseId',
  defaultSets: 'defaultSets',
  defaultReps: 'defaultReps',
  order: 'order'
};

exports.Prisma.WorkoutTrackingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionExerciseId: 'sessionExerciseId',
  sessionId: 'sessionId',
  date: 'date',
  completedSets: 'completedSets',
  completedReps: 'completedReps',
  weight: 'weight',
  notes: 'notes'
};

exports.Prisma.FavoriteScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type'
};

exports.Prisma.UserFavoriteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  favoriteId: 'favoriteId',
  createdAt: 'createdAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  basePrice: 'basePrice',
  stock: 'stock',
  image_url: 'image_url',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price',
  addedAt: 'addedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  orderDate: 'orderDate',
  status: 'status',
  total: 'total',
  addressId: 'addressId'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  target_id: 'target_id',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subject: 'subject',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  content: 'content',
  isStaff: 'isStaff',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.DayOfWeek = exports.$Enums.DayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY'
};

exports.MuscleGroup = exports.$Enums.MuscleGroup = {
  CHEST: 'CHEST',
  BACK: 'BACK',
  SHOULDERS: 'SHOULDERS',
  BICEPS: 'BICEPS',
  TRICEPS: 'TRICEPS',
  LEGS: 'LEGS',
  ABS: 'ABS',
  CARDIO: 'CARDIO'
};

exports.FavoriteType = exports.$Enums.FavoriteType = {
  EXERCISE: 'EXERCISE',
  PROGRAM: 'PROGRAM',
  PRODUCT: 'PRODUCT',
  SESSION: 'SESSION'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.CommentType = exports.$Enums.CommentType = {
  EXERCISE: 'EXERCISE',
  PROGRAM: 'PROGRAM',
  PRODUCT: 'PRODUCT'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED'
};

exports.Prisma.ModelName = {
  Role: 'Role',
  User: 'User',
  UserRole: 'UserRole',
  Theme: 'Theme',
  District: 'District',
  PostalCode: 'PostalCode',
  City: 'City',
  Address: 'Address',
  UserAddress: 'UserAddress',
  Program: 'Program',
  Session: 'Session',
  ProgramSession: 'ProgramSession',
  CustomExercise: 'CustomExercise',
  SessionExercise: 'SessionExercise',
  WorkoutTracking: 'WorkoutTracking',
  Favorite: 'Favorite',
  UserFavorite: 'UserFavorite',
  Cart: 'Cart',
  Product: 'Product',
  CartItem: 'CartItem',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Comment: 'Comment',
  SupportTicket: 'SupportTicket',
  TicketMessage: 'TicketMessage'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

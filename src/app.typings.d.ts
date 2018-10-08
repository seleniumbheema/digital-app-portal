/**
 * ESURE_GLOBALS, this is created in webpack using the DefinePlugin.
 */
declare var ESURE_GLOBALS: {
  ENDTOEND: boolean;
  BRAND: string;
  BRAND_CONFIG: BrandConfig;
  LOADING_SPRITE_DELAY: number;
};

interface BrandPhoneNumbers {
  motorCustomerService: string;
  motorAccidentRecovery: string;
  motorClaims: string;
  motorClaims24: string;
  motorWindscreen: string;
  motorLegal: string;
  motorBreakdown: string;
  motorKey: string;
  motorMisfuel: string;
  motorRenewals: string;
  motorMtaChangeReg: string;
  motorMtaChangeCar: string;
  motorMtaAddConviction: string;
  motorMtaAddDriver: string;
  homeCustomerService: string;
  homeClaims: string;
  homeEmergency: string;
  homePest: string;
  homeLegal: string;
  homeTravel: string;
  homeTravelEmergency: string;
  homeRenewals: string;
  homeWinter: string;
}

interface BrandUrls {
  proofOfNoClaims: string;
  travelQuote: string;
}

/**
 * Interface that the brand configuration JSON files should conform to.
 * src/config/esure.json
 * src/config/firstalternative.json
 * src/config/sheilaswheels.json
 */
interface BrandConfig {
  companyCode: 'E' | 'L' | 'F';
  brandName: string;
  brandUrl: string;
  brandCode: 'ES' | 'SW' | 'FA';
  motorProductType: 'MOTOR';
  homeProductType?: 'HOME'; // Optional as not all brands have a home product
  motorProductCode: 'EM' | 'SW' | 'FA';
  homeProductCode?: 'EH' | 'SH'; // Optional as not all brands have a home product
  tileColor: string;
  themeColor: string;
  backgroundColor: string;
  maskIconColor: string;
  fontColor: string;
  phoneNumbers: BrandPhoneNumbers;
  urls: BrandUrls;
}

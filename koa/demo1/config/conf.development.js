const PORT = 7766;

const PROXY = {
    APP : "http://127.0.0.1:9876/proxy",     // 泰然API
}

const DOMAIN = {
    "ACCOUNT"   : "http://passport.trc.com",
    "ASSETC"    : "http://jrstatic.trc.com",
    "BANK"      : "http://www.trc.com",
    "BANKPAY"   : "http://zjcg.trc.com",
    "BBS"       : "http://bbs.trc.com",
    "H5"        : "http://h5.trc.com", 
    "HELP"      : "http://jrhelp.trc.com",
    "HZCMS"     : "http://www.trc.com",
    "JRWX"      : "http://jrwx.trc.com",
    "MAIN"      : "http://www.trc.com",
    "NEWS"      : "http://news.trc.com",
    "SALE"      : "http://sale.trc.com",
    "USERCENTER": "http://jri.trc.com",
    "VIP"       : "http://vip.trc.com",
}

module.exports = {
    PORT,
    DOMAIN
}
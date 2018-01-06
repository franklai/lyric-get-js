module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "class-methods-use-this": "off",
        "camelcase": "off",
        "no-console": "off",
        "no-throw-literal": "off",
    },
    "env": {
        "browser": true,
    },
    "settings": {
        "import/core-modules": ["electron"],
    }
};
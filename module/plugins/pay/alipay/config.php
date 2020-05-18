<?php
if (!class_exists("Gc")) {
    require_once('../../../../../init.php');
}
$config = array (
		//应用ID,您的APPID。
		'app_id' => "2018110962089539",

		//商户私钥
		// 'merchant_private_key' => "g9q49tok2p724hgrbfgteatgvnch0bqq",
    // 'merchant_private_key' => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9o4sjYqyzdHH11nxBA0+8nd+anhpS7r/42YLuKwo0fQbqlLYREi+qiN/cvSZ+DrqVgkuvZhICPoLrI5GfE4j1JprjMgtsgi2ZtDcCoDMGJ5OKIFOsVrAkiwrQkcGfMsmeJE1K0ybpvB5QwHpVVVktahZ9ac1lSkIaKpVk+l+1S32C0WWYZWPvsUsBCy6WmKTzCIC8exJtDB0LvCe326a5ZKZQI6Wk2p5WRlhd1W+L8E7j6F9MCxIt3gJSxJEjxKTfZHDvvQxzwh9uGnS38YyNGjJwyU68mWaVsnLDR7KLAHhc54igGolrulCD7HOdWSIF8KzwSfZLlxw5aMiAB0lGwIDAQAB",
    'merchant_private_key' => "MIIEpQIBAAKCAQEA9o4sjYqyzdHH11nxBA0+8nd+anhpS7r/42YLuKwo0fQbqlLYREi+qiN/cvSZ+DrqVgkuvZhICPoLrI5GfE4j1JprjMgtsgi2ZtDcCoDMGJ5OKIFOsVrAkiwrQkcGfMsmeJE1K0ybpvB5QwHpVVVktahZ9ac1lSkIaKpVk+l+1S32C0WWYZWPvsUsBCy6WmKTzCIC8exJtDB0LvCe326a5ZKZQI6Wk2p5WRlhd1W+L8E7j6F9MCxIt3gJSxJEjxKTfZHDvvQxzwh9uGnS38YyNGjJwyU68mWaVsnLDR7KLAHhc54igGolrulCD7HOdWSIF8KzwSfZLlxw5aMiAB0lGwIDAQABAoIBAQDCCl6x/qh+J026BIUUhUA3HygUrzNfcIqW8ubirktqAU4MnCqsgvvbdxiE5lCO9f8bOxrYCBMZTYEGiuqaRf0ZA3cFUz3zUbwL6vBiK7902JH2et3t4tiPscdR4AgRCuj6Fn3b1+zgU3176PM0P4KFHTu/g5s+Cw8dIIE9aZRyPLBhDymGbLqwOcWsBxsGPBNHi19duDyprGPRRSQ/hgGYteW/Wslw504bYpTFyMbYLYd+oqAO/UhKhjo3ixSmLFcJwCAYFPpeD049AGMhnI+TSY2/V/OH9fqYXwd7Bj1c+Nz0/8wtuGpvgzSYvq5YoQU2DD2i7L2VV0+GcC72uoFhAoGBAP3FS05LDdHUtk9yuv0yXDaNPvzsb8he7BInTtUOnJbkEtR9/9I9OXSPzj2sIgLWKfcKxZrUjZjWlXZpOruajAZv7aE7LHfgpdJc/liW7x9QdJg0gnpS2M/FxETstYs898RcWSObfxDa5RdiHZOEPDpezvDVWblSv9J66XfC4zX5AoGBAPi4p0BtOA36eXwkG4zJaGw3jsLU/w83TZZno227cmfqJ2snv3ku3jmSuRPPWAA8ksCr64FiwCI5qDX/w7hmDXBngweujI+UJK98L0+rTgKAj+EG+AdKvRJxr0+okTqM0EViVOHrp9O9NNtQcLUBGlZnLbwnvaTBm/qtUKnHK6izAoGBAKydIMYWo0XRLFkKL0q+kJ7CoM+le7uNZYJLnoGpuLWiWXSUaAh3gLdagezNQy0uw8i4WQUiA1asz2mF1l95ljlitP5wo6S+98wJWTClKe3g6g4F2aKe678YRJKleC9HvzifoDpqMJokaqPnJzsKPXVuu9BxLuCx+qyO0nOV6rrxAoGAToKDENwo+Iia9muzYpJk6tvyrV9sj5IGZLacKNQlfdW00ac/UnJP5V6CG1W00oZMUJM0CKhyO5t1lG4Cit9z2IpkGvWnGt9JYTdS+9P4EOQiBocbnbmiywKlswBjr1apm205nAK1/ClaWOwgV5JcjO+OyTjGLQ6MPOmeb6kWB+8CgYEAsaI09OVqmRi/a9ilFMZ7vFBrsW6qa6ignRBEeMccKc391uy9ey7Thp/oTDb5iNBSNlEjssvhdS+BxvgOg50sNk6YZRJamOgV1Cd0rpQxQIMCiBVVzDIjEx3OExl3PosTXjatNx/obVcsJ2APkZ5nlLZXgPpILZm2djEeG0u2S/Y=",

		//异步通知地址
		'notify_url' => Gc::$url_base . "module/plugins/pay/alipay/notify_url.php",

		//同步跳转
		'return_url' => Gc::$url_base . "module/plugins/pay/alipay/return_url.php",

		//编码格式
		'charset' => "UTF-8",

		//签名方式
		'sign_type'=>"RSA2",

		//支付宝网关
		'gatewayUrl' => "https://openapi.alipay.com/gateway.do",

		//支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
		'alipay_public_key' => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAznWytL7w/dXxwXZmA57OyqWteoVU3zuzGqvOSOm8hUtTPkkSWR/KhYfI2/9WUTVfQPQyNf7FAjqOwapQFyMIZVQdmfvIEuYHxXnPMIbrfp20THKkG/ZWJA3mFc7VQnAejL5tHVz5UZJZ+9yJ5TiapXvzhkOjzAYRHCfVq9RQEMx/KiHoahh4GWTwUpTwdyIiPlRTYdxFkhW+MP8UoR6j0jAY/OLSFvg1sSOD1rZLZFcosTHMwI4ncKBkl1gZF2XfHDLs6xkeABNZL2/WcDYXqYB4SnlgBxg9tcnZ1XsvaRTn1eG7eBb+MzL228FNjnidLq/8p1aUugpjylBx0kXrswIDAQAB",
);

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./resources/scss/app.scss":
/*!*********************************!*\
  !*** ./resources/scss/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/scss/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/abm2018/Documents/Dhiraj/GitHub/job-notifier/resources/js/app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! /Users/abm2018/Documents/Dhiraj/GitHub/job-notifier/resources/scss/app.scss */"./resources/scss/app.scss");


/***/ })

/******/ });


var socket=io() 

var table = document.getElementById("job-table");

// make connection with server from user side 
socket.on('diffed changes', function(data){
  console.log(`File changed: ${data}`);  
  tbody = table.getElementsByTagName('tbody')[0];
  data.forEach(eachRow => {
    newRow = tbody.insertRow(0)
    newRow.style.background = "#FFE77AFF"
    let td = document.createElement("td");
    td.innerHTML = "NEW"
    newRow.appendChild(td);
    for (const property in eachRow) {
      td = document.createElement("td");
      td.innerHTML = eachRow[property]
      newRow.appendChild(td);
    }
  });

});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log(`Successfully registered service worker to ${registration.scope}`);
      // logic to handle notification subscriptions goes here...
      if ('Notification' in window) {
        var notify_me_button = document.createElement('button');
        notify_me_button.id = "notify-me";
        notify_me_button.innerText = 'Send me Notifications';
        notify_me_button.addEventListener('click', function(event) {
          Notification.requestPermission()
            .then(function(permission) {
              console.log("Permission: ", permission);
              if (permission == 'granted') {
                  // fetch the public VAPID key
                  fetch('/subscription/public-key/')
                  .then(function(response) {
                    console.log('Raw fetch response:', response);
                    return response.json();
                  })
                  .then(function(data) {
                    console.log('Fetch response data: ', data);
                    var options = {
                      userVisibleOnly: true,
                      applicationServerKey:  urlBase64ToUint8Array(data.vapid_public_key)
                    };
                    registration.pushManager.subscribe(options)
                      .then(function(subscription) {
                        // diagnostic of the subscription object returned by subscribe():
                        // console.log(JSON.stringify(subscription));
                        // Logic here to then save the subscription by calling fetch('/subscription', ...);
                        fetch('/subscription/',
                          { method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(subscription) })
                          .then(function(response) { return response.json(); })
                          .then(function(response) { console.log(response); })
                          .catch(function(error) {
                            console.error('Error: ', error);
                          });
                        })
                        .catch(function(error) {
                          console.error('Subscription error: ', error);
                        }); // end subscription
                  })
                  .catch(function(error) {
                    console.error('Fetch error: ', error);
                  }); //
              } // if permission granted
            })
            .catch(function(error) {
              console.error('Permission error:', error);
            });
        });
        document.getElementById('notify_button').append(notify_me_button);
      }

    })
    .catch(function(error) {
      console.error('Could not register service worker', error);
    });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
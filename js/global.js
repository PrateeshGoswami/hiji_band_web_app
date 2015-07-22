/**
 *-----------------------------------------------------------------------------
 * This file defines ALL global variables, functions, events and event
 * handlers.
 *
 * @author Prateesh Goswami
 *         Adolph Seema
 *
 * @date   2015/05/10
 *
 *-----------------------------------------------------------------------------
*/

//------------------------Global variables-------------------------------------

//Used by external code to syncronize with overall simulator clock.
var g_ticks_since_boot = 0;

//Global value returned by an external simulate_acceleration function
var g_sim_xyz_array = 0; //use to peek at the values. i.e. not updating them

var g_impact_level = 0;

//Hack job for enums, globally accessible
var G_OK       = 0;
var G_MILD     = 1;
var G_MODERATE = 2;
var G_SEVERE   = 3;

//------------------------Helper functions-------------------------------------

/**
 *-----------------------------------------------------------------------------
 * This function reads and gets parameter values from a URL string.
 * It justs makes getting URL parameters and their values more convenient.
 * It can read a page's GET URL variables and return them as an associative
 * array.
 *
 * For example, consider we have the following URL:
 * http://www.example.com/?me=myValue&name2=SomeOtherValue
 * Calling getUrlVars() function would return you the following array:
 *  {
 *    "me"    : "myValue",
 *    "name2" : "SomeOtherValue"
 *  }
 *
 * To Get object of URL parameters:
 *   var allVars = $.getUrlVars();
 * To get URL var by its name
 *   var byName = $.getUrlVar('name');
 *
 * @author Roshambo, Karthikeyan K, Adolph Seema.
 * @date   2015/05/10
 *
 * @param  {window.location.href} - this page's incoming URL.
 *
 * @return an array/object - with your URL parameters and their values.

 *-----------------------------------------------------------------------------
 */

$.extend({

  getUrlVars: function(){

    var vars = [], hash;

    var hashes = window.location.href.slice(
                   window.location.href.indexOf('?') + 1
                 ).split('&');

    for(var i = 0; i < hashes.length; i++) {

      hash = hashes[i].split('=');

      vars.push(hash[0]);

      vars[hash[0]] = hash[1];

    }
    return vars;
  },

  getUrlVar: function(name) {
    return $.getUrlVars()[name];
  }

});

//------------------------Global functions-------------------------------------

(function( $, undefined ) {
  //special click handling to make widget work remove after nav changes in 1.4
  var href,
    ele = "";
  $( document ).on( "click", "a", function( e ) {
    href = $( this ).attr( "href" );
    var hash = $.mobile.path.parseUrl( href );
    if( typeof href !== "undefined" && hash !== "" && href !== href.replace( hash,"" ) && hash.search( "/" ) !== -1 ){
      //remove the hash from the link to allow normal loading of the page.
      var newHref = href.replace( hash,"" );
      $( this ).attr( "href", newHref );
    }
    ele = $( this );
  });
  $( document ).on( "pagebeforechange", function( e, f ){
      f.originalHref = href;
  });
  $( document ).on("pagebeforechange", function( e,f ){
    var hash = $.mobile.path.parseUrl(f.toPage).hash,
      hashEl, hashElInPage;

    try {
      hashEl = $( hash );
    } catch( e ) {
      hashEl = $();
    }

    try {
      hashElInPage = $( ".ui-page-active " + hash );
    } catch( e ) {
      hashElInPage = $();
    }

    if( typeof hash !== "undefined" &&
      hash.search( "/" ) === -1 &&
      hash !== "" &&
      hashEl.length > 0 &&
      !hashEl.hasClass( "ui-page" ) &&
      !hashEl.hasClass( "ui-popup" ) &&
      hashEl.data('role') !== "page" &&
      !hashElInPage.hasClass( "ui-panel" ) &&
      !hashElInPage.hasClass( "ui-popup" ) ) {
      //scroll to the id
      var pos = hashEl.offset().top;
      $.mobile.silentScroll( pos );
      $.mobile.navigate( hash, '', true );
    } else if( typeof f.toPage !== "object" &&
      hash !== "" &&
      $.mobile.path.parseUrl( href ).hash !== "" &&
      !hashEl.hasClass( "ui-page" ) && hashEl.attr('data-role') !== "page" &&
      !hashElInPage.hasClass( "ui-panel" ) &&
      !hashElInPage.hasClass( "ui-popup" ) ) {
      $( ele ).attr( "href", href );
      $.mobile.document.one( "pagechange", function() {
        if( typeof hash !== "undefined" &&
          hash.search( "/" ) === -1 &&
          hash !== "" &&
          hashEl.length > 0 &&
          hashElInPage.length > 0 &&
          !hashEl.hasClass( "ui-page" ) &&
          hashEl.data('role') !== "page" &&
          !hashElInPage.hasClass( "ui-panel" ) &&
          !hashElInPage.hasClass( "ui-popup" ) ) {
          hash = $.mobile.path.parseUrl( href ).hash;
          var pos = hashElInPage.offset().top;
          $.mobile.silentScroll( pos );
        }
      } );
    }
  });
  $( document ).on( "mobileinit", function(){
    hash = window.location.hash;
    $.mobile.document.one( "pageshow", function(){
      var hashEl, hashElInPage;

      try {
        hashEl = $( hash );
      } catch( e ) {
        hashEl = $();
      }

      try {
        hashElInPage = $( ".ui-page-active " + hash );
      } catch( e ) {
        hashElInPage = $();
      }

      if( hash !== "" &&
        hashEl.length > 0 &&
        hashElInPage.length > 0 &&
        hashEl.attr('data-role') !== "page" &&
        !hashEl.hasClass( "ui-page" ) &&
        !hashElInPage.hasClass( "ui-panel" ) &&
        !hashElInPage.hasClass( "ui-popup" ) &&
        !hashEl.is( "body" ) ){
        var pos = hashElInPage.offset().top;
        setTimeout( function(){
          $.mobile.silentScroll( pos );
        }, 100 );
      }
    });
  });
})( jQuery );

$( document ).on( "pagecreate", ".jqm-band", function( event ) {
  var page = $( this )
  // Global navmenu panel
  $( ".jqm-navmenu-panel ul" ).listview();


  $( ".jqm-navmenu-link" ).on( "click", function() {
    page.find( ".jqm-navmenu-panel:not(.jqm-panel-page-nav)" ).panel( "open" );
  });


  // Global search
  $( ".jqm-panel-link" ).on( "click", function() {
    page.find( ".jqm-right-panel" ).panel( "open" );
  });
  $(".btn-back").on("click",function(){
      history.back() ;
  })
});

$( document ).on( "pagecreate",".jqm-device-confirm", function( event ) {
  var page = $( this )
  $( ".btn-detail" ).on( "click", function() {
    window.location.href = 'graph-details.html';
  });
});

$( document ).on( "pagecreate",".jqm-graph-details", function( event ) {
  var page = $( this )
  $( ".btn-home" ).on( "click", function() {
    window.location.href = 'index.html';
  });
});

$( document ).on( "pagecreate", ".jqm-home", function( event ) {
  var page = $( this )
  setTimeout( function(){
    window.location.href = 'device-confirm.html';
  }, 2000 );
});

$( document ).on( "sim_impact_level_event", function( event, arg1, arg2 ) {
  //console.log( arg1 ); //impact level
  //console.log( arg2 ); //acceleration data array
  //alert("what the2?");

  window.location.href =
    "device-confirm.html?PostData1=" + arg1 + "&PostData2=" + arg2;

});

/**
 *-----------------------------------------------------------------------------
 * This function is the global clock which all simulated variables use as a
 * reference. We want to be able to syncronize and repeate the simulated
 * behavior. It provides the ticks every second that all other modules can use
 * for their behaviours or synchronize to.
 *
 * @author Adolph Seema.
 * @date   2015/05/10
 *
 * @param  {Number} milliseconds - interval tick of the clock
 *
 * @return void - just schedules the simulator variable updates
 *-----------------------------------------------------------------------------
 */
function simulator_clock() {

  g_ticks_since_boot += 1;

  //Below, we create and fire a simulator_tick event which also broadcasts the
  //number of ticks (seconds) since this app loaded.
  //$( document ).trigger( "myCustomEvent", [ "hello", g_ticks_since_boot ] );
  //Above example shows we can send more args is we needed.

  $( document ).trigger( "sim_tick_event", g_ticks_since_boot );

}

//start the clock
var g_sim_clock = setInterval(function(){simulator_clock()},1000);

//--------------------END.OF.DOCUMENT...80.columns.wide------------------------
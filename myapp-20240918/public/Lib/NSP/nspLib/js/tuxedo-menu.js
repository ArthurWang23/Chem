(function ($) {
    'use strict';
    var settings;

    $.fn.tuxedoMenu = function (options) {
        var self = this;
        settings = $.extend({
            menuSelector: '.tuxedo-menu',
            isFixed: true
        }, options);
        self.addClass('tuxedo-menu tuxedo-menu-pristine animated')
        return self;
    };
})(jQuery);


// (function ($) {
//     $('#sidebar').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#sidebar').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });

// })(jQuery);
// (function ($) {
//     $('#devises-list1').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list1').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list2').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list2').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list3').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list3').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list4_1').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list4_1').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list4_2').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list4_2').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list4_3').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list4_3').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list5_1').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list5_1').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list5_2').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list5_2').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
// (function ($) {
//     $('#devises-list5_3').tuxedoMenu({ isFixed: false }).metisMenu({
//         toggle: false,
//         activeClass: 'active'
//     }).click(function (event) {
//         var MenuItemActive = $('#devises-list5_3').find("a.active");
//         if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
//         var MenuItemClicked = $(event.target).closest('a');
//         if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
//     });
// })(jQuery);
(function ($) {
    $('.tuxedo-menu').tuxedoMenu({ isFixed: false }).metisMenu({
        toggle: false,
        activeClass: 'active'
    }).click(function (event) {
        var menu = $(event.target).closest('.tuxedo-menu');
        var MenuItemActive = $(menu).find("a.active");
        if (MenuItemActive.length === 1) { MenuItemActive.removeClass('active'); }
        var MenuItemClicked = $(event.target).closest('a');
        if (MenuItemClicked.length === 1) { MenuItemClicked.addClass('active'); }
    });
})(jQuery);


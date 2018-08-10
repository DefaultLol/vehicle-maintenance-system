odoo.define('vms_report_kiosk.kiosk_mode', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var Widget = require('web.Widget');
var Session = require('web.session');
var QWeb = core.qweb;
var _t = core._t;


var KioskMode = Widget.extend({
    events: {
        "click .btn_vms_report": 'go_to_report',
        "click .btn_vms_make_report": 'make_report',
        'click .o_vms_alert': 'slide',
    },

    start: function () {
        var self = this;
        core.bus.on('barcode_scanned', this, this._onBarcodeScanned);
        self.session = Session;
        var def = this._rpc({
                model: 'res.company',
                method: 'search_read',
                args: [[['id', '=', this.session.company_id]], ['name']],
            })
            .then(function (companies){
                self.company_name = companies[0].name;
                self.company_image_url = self.session.url('/web/image', {model: 'res.company', id: self.session.company_id, field: 'logo',});
                self.$el.html(QWeb.render("VmsReportMyMainMenu", {widget: self}));
                self.start_clock();
                self.employees();
                self.units();
            });
        // Make a RPC call every day to keep the session alive
        self._interval = window.setInterval(this._callServer.bind(this), (60*60*1000*24));
        return $.when(def, this._super.apply(this, arguments));
    },

    load_f: function() {
        var self = this;
        self.$el.find('.fr-view').froalaEditor(); 
    },


    slide: function() {
        var self = this;        
        $('#o_vms_alerts_container').hide();
    },

    _onBarcodeScanned: function(barcode) {
        var self = this;
        this._rpc({
                model: 'hr.employee',
                method: 'attendance_scan',
                args: [barcode, ],
            })
            .then(function (result) {
                if (result.action) {
                    self.do_action(result.action);
                } else if (result.warning) {
                    self.do_warn(result.warning);
                }
            });
    },

    employees: function() {
        var self = this;
        this._rpc({
                model: 'hr.employee',
                method: 'search_read',
                fields: ['name'],
                domain: [['mechanic', '=', true]],
                args: [],
            })
            .then(function (employees) {
                self.$el.find('#o_vms_employee').html(QWeb.render("VmsEmployeeList", {employees: employees}));   
            });
    },

    units: function() {
        var self = this;
        this._rpc({
                model: 'fleet.vehicle',
                method: 'search_read',
                fields: ['name'],
                args: [],
            })
            .then(function (units) {
                self.$el.find('#o_vms_unit').html(QWeb.render("VmsUnitList", {units: units}));
            });
    },

    show_warning: function() {
        var self = this;
        $('#o_vms_alerts_container').html("<div class='alert alert-warning'><a id='o_vms_alert'><i class='fa fa-fw fa-arrow-circle-right'/></a>"+
            _t('Required Fields') +"</div>");
    },

    go_to_report: function() {
        var self = this;
        self.driver_name = self.$el.find('select#select_employee_id option:checked').text();
        self.driver_id = self.$el.find('select#select_employee_id option:checked').val();
        self.units_name = self.$el.find('select#select_unit_id option:checked').text();
        self.units_id = self.$el.find('select#select_unit_id option:checked').val();
        if (self.driver_id == "" || self.units_id == ""){
            return self.show_warning();
        }
        else{
            $('#o_vms_alerts_container').empty();
        }
        self.$el.html(QWeb.render("MyReportKioskMode", {widget: self,}));
        self.load_f();
    },

    make_report: function() {
        var self = this;
        debugger;
        self.html_id = self.$el.find('#fr-textarea').val();
    },

    start_clock: function() {
        this.clock_start = setInterval(function() {this.$(".o_vms_report_clock").text(new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));}, 500);
        // First clock refresh before interval to avoid delay
        this.$(".o_vms_report_clock").text(new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}));
    },

    destroy: function () {
        core.bus.off('barcode_scanned', this, this._onBarcodeScanned);
        clearInterval(this.clock_start);
        clearInterval(this._interval);
        this._super.apply(this, arguments);
    },

    _callServer: function () {
        // Make a call to the database to avoid the auto close of the session
        return ajax.rpc("/web/webclient/version_info", {});
    },

});

core.action_registry.add('vms_report_action_report_kiosk', KioskMode);

return KioskMode;

});

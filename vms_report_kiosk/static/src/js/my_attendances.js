odoo.define('vms_report_kiosk.my_attendances', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var Widget = require('web.Widget');
var Session = require('web.session');

var QWeb = core.qweb;
var _t = core._t;


var VmsReport = Widget.extend({
    events: {
        "click .o_hr_attendance_button_employees": function(){ this.do_action('hr_attendance.hr_employee_attendance_action_kanban'); },
    },
    
    start: function () {
        var self = this;
        self.session = self.getSession();
        var def = self._rpc({
                model: 'res.company',
                method: 'search_read',
                args: [[['id', '=', self.session.company_id]], ['name']],
            })
            .then(function (res) {
                // if (_.isEmpty(res) ) {
                //     self.$('.o_hr_attendance_employee').append(_t("Error : Could not find employee linked to user"));
                //     return;
                // }
                self.company_name = res[0].name;
                self.company_image_url = self.session.url('/web/image', {model: 'res.company', id: self.session.company_id, field: 'logo',});
                self.$el.html(QWeb.render("VmsReportMyMainMenu", {widget: self}));
            });

            return $.when(def, self._super.apply(this, arguments));
    },

    // update_attendance: function () {
    //     var self = this;
    //     this._rpc({
    //             model: 'hr.employee',
    //             method: 'attendance_manual',
    //             args: [[self.employee.id], 'hr_attendance.hr_attendance_action_my_attendances'],
    //         })
    //         .then(function(result) {
    //             if (result.action) {
    //                 self.do_action(result.action);
    //             } else if (result.warning) {
    //                 self.do_warn(result.warning);
    //             }
    //         });
    // },
});
core.action_registry.add('vms_report_action_report_kiosk', VmsReport);

return VmsReport

});



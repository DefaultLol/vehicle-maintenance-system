# Copyright 2018, Jarsa Sistemas, S.A. de C.V.
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import werkzeug.utils
from odoo import http
from odoo.http import request


class VmsReportKioskController(http.Controller):

    @http.route(['/web/vms/report'], type='http', auth="user")
    def vms_report_redirection(self):
        return werkzeug.utils.redirect(
            '/web#action=vms_report_kiosk.vms_report_action_report')

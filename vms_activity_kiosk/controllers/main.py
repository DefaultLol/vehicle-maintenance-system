# Copyright 2018, Jarsa Sistemas, S.A. de C.V.
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

import werkzeug.utils
from odoo import _, http
from odoo.exceptions import ValidationError
from odoo.http import request


class VmsActivityKioskController(http.Controller):

    @http.route(['/web/vms/activity'], type='http', auth="user")
    def vms_activity_redirection(self):
        return werkzeug.utils.redirect(
            '/web#action=vms_activity_kiosk.vms_activity_kiosk_action')

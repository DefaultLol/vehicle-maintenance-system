# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from random import choice
from string import digits

from odoo import models, fields


class HrEmployee(models.Model):
    _inherit = "hr.employee"
    _description = "Employee"

    def _default_random_barcode(self):
        barcode = None
        while not barcode or self.env['hr.employee'].search([(
                'barcode', '=', barcode)]):
            barcode = "".join(choice(digits) for i in range(8))
        return barcode

    barcode_vms = fields.Char(
        string="Badge ID",
        help="ID used for employee identification.",
        default=_default_random_barcode, copy=False
    )
    _sql_constraints = [(
        'barcode_uniq', 'unique (barcode)',
        "The Badge ID must be unique," +
        " this one is already assigned to another employee.")]

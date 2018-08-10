# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


{
    'name': 'Vms Report',
    'version': '2.0',
    'category': 'Human Resources',
    'sequence': 81,
    'summary': 'Manage employee attendances',
    'description': """
This module aims to manage employee's attendances.
==================================================

Keeps account of the attendances of the employees on the basis of the
actions(Check in/Check out) performed by them.
       """,
    'website': 'https://www.odoo.com/page/employees',
    'depends': ['vms', 'barcodes'],
    'data': [
        # 'security/ir.model.access.csv',
        'views/web_asset_backend_template.xml',
        'views/hr_attendance_view.xml',
    ],
    'demo': [],
    'installable': True,
    'auto_install': False,
    'qweb': [
        "static/src/xml/vms_report.xml",
    ],
    'application': False,
}

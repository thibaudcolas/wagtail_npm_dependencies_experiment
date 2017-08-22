from __future__ import absolute_import, unicode_literals

from django.contrib.staticfiles.templatetags.staticfiles import static
from django.utils.html import format_html
from wagtail.wagtailcore import hooks


@hooks.register('insert_global_admin_js')
def insert_global_admin_js():
    scripts = {}
    for hook in hooks.get_hooks('enqueue_scripts'):
        scripts.update(hook())

    HTML = '\n'.join([
        '<script src="{}"></script>'.format(
            static(meta['source'])
        ) for handle, meta in scripts.items()
    ])

    return HTML


@hooks.register('insert_global_admin_css')
def insert_global_admin_css():
    styles = {}
    for hook in hooks.get_hooks('enqueue_styles'):
        styles.update(hook())

    HTML = '\n'.join([
        '<link rel="stylesheet" href="{}">'.format(
            static(meta['source'])
        ) for handle, meta in styles.items()
    ])

    return HTML

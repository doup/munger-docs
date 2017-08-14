$(function () {
    $(document).foundation();

    $('[data-docs-menu-toggle]').hover(function () {
        $('[data-docs-menu]').show();
    })

    $('[data-docs-menu]').mouseleave(function () {
        $(this).hide()
    });
});

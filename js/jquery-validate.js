Validator = {
    validate: function (form) {
        var hasError = false;
        $(form).find('input, select, textarea').each(function () {
            if(!$(form).validate().element($(this))){
                hasError = true;
                $(this).focus();
                return false;
            }
        });
        return !hasError;
    }
}
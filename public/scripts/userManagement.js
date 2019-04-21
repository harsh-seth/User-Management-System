$(document).ready(() => {
    $('#deleteUserBtn').click(() => {
        $('#deleteUserConfirmationMessageRow').show()
        $('#deleteUserConfirmationInputRow').show()
        $('#deleteUserMessage').hide()
    })

    $('#deleteUserNoBtn').click(() => {
        $('#deleteUserConfirmationMessageRow').hide()
        $('#deleteUserConfirmationInputRow').hide()
        $('#deleteUserQuery').val("")
        $('#deleteUserMessage').hide()
    })

    $('#deleteUserYesBtn').click(() => {
        $('#deleteUserConfirmationMessageRow').hide()
        $('#deleteUserConfirmationInputRow').hide()
        var email = $('#deleteUserQuery').val()
        $('#deleteUserQuery').val("")
        $('#deleteUserMessage').hide()

        $.ajax({
            url: '/user?email=' + email,
            type: 'DELETE',
            success: (res) => {
                $('#deleteUserMessage').text(res.deleteSuccess).removeClass('danger').show()
            },
            error: (res) => {
                res = JSON.parse(res.responseText)
                if ('message' in res)
                    $('#deleteUserMessage').text(res.message).addClass('danger').show()
                else if ('deleteError' in res)
                    $('#deleteUserMessage').text(res.deleteError).addClass('danger').show()
            }
        })
    })
})
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
        var emailId = $('#deleteUserQuery').val()
        $('#deleteUserQuery').val("")
        $('#deleteUserMessage').hide()

        $.ajax({
            url: '/user?emailId=' + emailId,
            type: 'DELETE',
            success: (res) => {
                $('#deleteUserMessage').text(res.deleteSuccess).removeClass('danger').show()
            },
            error: (res) => {
                res = JSON.parse(res.responseText)
                $('#deleteUserMessage').text(res.deleteError).addClass('danger').show()
            }
        })
    })
})
/**
 * {:noCode: Simple HTML Editor :}
 * https://github.com/TheNocoder/ncSimpleHtmlEditor
 *
 * MIT License
 *
 * Copyright (c) 2022 Enrique F. Castañón B
 * All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
    window.ncSimpleHtmlEditor = function (options = {}) {
        var _this = this;

        const defaults = {

            // editable selector, default "body"
            editable: "body",

            // Non-linear undo/redo history possible
            linearHistory: true,

            // Several mutations can belong to the same update in the history, they are grouped by time, in milliseconds.
            groupingHistory: 200,

            // Number of toolbar columns, by default null, as set in css
            toolbarCols: null,

            // Save button, disable on click in milliseconds
            saveTimeout: 500,

            // Active buttons and toolbar order
            toolbar: ['edit', 'undo', 'redo', 'up', 'down', 'cut', 'copy', 'paste', 'code', 'link', 'image', 'head', 'save'],

            // tootlbar buttons
            buttons: {
                edit: {
                    name: 'edit',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABP0lEQVRo3u3YMU4CQRTG8T+7nkM3HkUTK26BHa2Vt9BGGlAEgl5Dz2E2XoFGGqLNTljJDDNLwXtD3pdMQTIkv+/tsNkFLBaLxQIV8AmsgAeglAZ1yTnwBfy21jtwJg07FJ9NiX34LEoMI3i3Fij+TdwnlniUhrpUwNUBJVbScIevgR/gpmOJDy14B+pSogYuJPGhu80a6O/svdvZ8w1casSnlBDHV/w/NqHlO07D5vtiCU1+AgyADfErIZYK/+THQNHsucV/Ja6l8fsm7/A94MmzR/zMnyT++ZTwo1zxRfM5G/yS7eNvAbwY3vBpePfqlx3+rYUvc8dPDW/4OL79X41aPPgfiedsb5UlMPPsqRF+GXGJTf4VpZMPFWhPfo7iyYcKOLz6yYcKhJZKfGoBtfiUAqrxsQLq8RaLxXKc/AH+RGvPIDl6DwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxNDo1ODoyMyswMDowMGRD6r4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTQ6NTg6MjMrMDA6MDAVHlICAAAAAElFTkSuQmCC',
                    icon2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAACI0lEQVRo3u3YsWoUURTG8Z9ICIiNsDEiioioKGEbK0uxUWwkjU9kbRUbn8BitQkE0byBTUSx0FgkisaAaCGITSx2Bzezd3buzM7OzJL9YNhqzvy/c+45995lrrnmmmsuOljHL6xhoWmgIlrCFg6GnnUsNg1WFn5mTCzhTQZ8aRMdbKJbg4E7+Jtj4AA9kT3R8b+c+zWZWI00sRYT7FXqpWmY6AZixpj4GRN8BXtTNNEdxAvFzDPxMvYjV/El9fIP3KgIflzMe/gTgN/GcpGPXcHnCk2k4YuY2B/wFNZl7FZgIgs+xsRv3CyZNHAJO8r3RB78uJiruDsJfKIL+muwaCWy4Hu4b3StV9FnY018ishaDHyyIT0QV4nKdB4fIz/4Igf+OJ7WbQDO4J380p90eFMchj+GJwH479OGT7SMtxEmFvE8AP+4SfhEoUqEyr/g8CHskQaWTZZOGz0Kj5skD7Ug82ndFpfRE0YvLY1lPtG4TSpUiVN4rSWZj9lhQxmu87JUGH5DP7OtWiax8MmovIav4hu7VfAGvxtaNCqLwj+T3RONVaIK+MZMTAL/Hrc03BMx8L0M+OQOG0pCbT1RJvMfcDYVp7HplIbLy/w2zmXEaqQSacAEPpT5HVzMiVd7JfKmSvLs6v8BEKNaTcTAfxtAFVFtJvLg93C9ZOxaTOSdNlcmjN/qs9ORMhEasZtNQxXVcCW29C8/M6eufuZnEv7o6h+WFd8aD3ft0gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxNDo1ODozMSswMDowMD92+wkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTQ6NTg6MzErMDA6MDBOK0O1AAAAAElFTkSuQmCC',
                    title: 'Edit',
                    disabled: function () { return _this.disabledEdit() },
                    action: function () { _this.editToggle() }
                },
                code: {
                    name: 'code',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAACIElEQVRo3u2ZsUscQRjFf8ZCMFVSmFIskiqkUxEkXbAJFmJO0MQmraSxDYLYJVVII5axCakEm5C/IBwh2ClBxPaKWNhEjMlZXA7mHrPZmZ3ZGYR9cMXevO99783s7c7tQoMGDRrkxHCiPgvAHjADjAO/gE7u8D54A3SNz9tYwrcSBZiS43aivlEwDJwzuALjuU354JGYj3ruh55Cyw6cSTluV9CoBS3gtwNvh8EVeC3jV8CLXOa7DtwDCfBExrupQ5jmywKMCvcvcMcSIFkINV8W4LFwjywcc7zWEMv/GpgNy34D68LftXB0Qq6o4Ydtm3mXRp+kZs3CWQQuqXElqpoHOJW6yQJebSFCzI9J3QUw8h9+9BAh5gHmpfarQ020EKHmAbak/p1jXXCIGOYBvojGc4/ayiFimR8CzkTnvqeGUwjXzdyQZ/MHDN5xz4BjT42ivqXbl6JVWPFovCr1nz2NLxZ4cD4NnwUKvJfaTQ/zob2jCLWl7mlq8yGCI/RuWmbNvRzmqwpPC/fEoUfLs0e0ELbr8ivhfcxtvo+lgkaKXeGsl+jatuhLsc33Ybu8KX7I+GyJZsjlOkoIE3fp/W00Z/O2Y4Ak5m0hTMwxOKPfHbSSmzdDXMp3GxJg20Eni/k+WnK8LwFeVtDIio4EeJjbkA8mxPw5Cd4/xHy8ro/QvwF/bnKAJO8AYi5xh95N7Ce9Dd0H4DBFiAYNGjTIh2vrWlwSpGLTnQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxNDo1OTo1MiswMDowMCczgy0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTQ6NTk6NTIrMDA6MDBWbjuRAAAAAElFTkSuQmCC',
                    title: 'Code',
                    disabled: function () { return _this.disabledCode() },
                    action: function () { _this.editCode() }
                },
                undo: {
                    name: 'undo',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABhklEQVRo3u3WMWsUURDA8Z9i5CQaG5toIURMIRLUJo3Gyi5fxVYbwWATIYVo48ewsLJUsFFMYZVCiyTNhQhBwXDEnGfxVjiWvTWn7xED84dpdpeZ+e/Mg0cQBEEQBEEQ/E88PuwG/pXBUZI4MeL5ffSwNEauCdzELdzAZUzjNH7gC7axibd4g1Xs55YaDMVBBK7iedXgYMzYwZNKtohAm8QVvMTPv2i8Hv0q12wJgfqZmJBWbC9D4/XYq2p1cgv8nsRFaW9zN16PDzh/kGaPjRAYxXdMtrzfxWu8wntsoVvlPCcd6nncxh2cacm1iUV8zDWBtuji3h8aqjOFu/jUkvcr5koK9LGMU+MWGaIjrWdvRI11aXLZBb5Jq5CLa9LaNNV6h5MlJrCUUQAuSDvfVOtBCYES145pbDTU2cWlEgIlJnFd85l4UUqgxCQeNdToY6aUQO5JdPC5ocbK8EfHM/+1hxklenhae9aVrhut5LgK5JI4izU8w4L8PzwIgiAIgiAIgiPML+zxM5YSM3skAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA5LTE2VDE1OjAxOjUyKzAwOjAwmCW2HgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wOS0xNlQxNTowMTo1MiswMDowMOl4DqIAAAAASUVORK5CYII=',
                    title: 'Undo',
                    disabled: function () { return _this.disabledUno() },
                    action: function () { _this.undo() }
                },
                redo: {
                    name: 'redo',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABiklEQVRo3u3WT0tUURjH8U+hhoSuijQqd4oECS1aBJK73ktvoCCs2am7auHLCIJatSraRFjbsDYFUVAgRqFWji7uLPQ4c+femWO6eL5wFvfP8/D9nXMv5xAEQRAEQRAEQTUaRy3Qr/xOenMgQ+MBXMUNXMdFnMUZDOIXvuID3uIlXuFfTfn7uWdkEg+x1pqZOuM7lnG5ovze2r6ZwjM0exBPRxNPMF1Rvq8Ag7iNzQzi6fiLRZzqIt9zgPNYOQTxdKxgokT+QIATFeRn8BQXSt75ied4gdf4hh+t/mM4h2u4qfjZh0t6/cbpkudVnPfJr5fMxipuYaRGz1HcaYXsZZUqM47PHZpsYB5DdRomDGMJ24cRYAhvOjT4hCt9iKfMKT7BrAHudih+11qZnDRqyFcKMKHYPdPCL8p/5P8hXynAY+2/+ZljIN81wCXFGSUtundM5LsGWGhT8NH+HfIo5Q8EOJlc/1GcHPfyAFsZ5bOfKtuFmsUjvFdsPLnkcxw3giAIgiAIgiAIwC7w7i5ZynjYFQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxNTowMjowNCswMDowMFgiNkMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTU6MDI6MDQrMDA6MDApf47/AAAAAElFTkSuQmCC',
                    title: 'Redo',
                    disabled: function () { return _this.disabledRedo() },
                    action: function () { _this.redo() }
                },
                up: {
                    name: 'up',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAAsUlEQVRo3u3VTQqCUBhG4dMP0aBZbaLVNWzaRlqJm2gpzmoSNXGQYJJe7bsXzgOCA9H3CCJIkqRei+gBKS7AFVhGDxk7/tUcxUV8ji8uomt8MRF947OP+GV8thFDxmcXMWZ8NhEp4yeJWCWMPwFn4PHl2NL+C9fAveO6I7AHqr+88gFq2m/6MMdDsviIDCiZAdEMiGZANAOiGRDNgGjFB6xnvPcN2DXnG+AZHStJkqb2BvfBZVUwT6fHAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA5LTI3VDExOjAxOjU1KzAwOjAwYMkoEwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wOS0yN1QxMTowMTo1NSswMDowMBGUkK8AAAAASUVORK5CYII=',
                    title: 'Select up',
                    disabled: function () { return _this.disabledUp() },
                    action: function () { _this.up() }
                },
                down: {
                    name: 'down',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAArUlEQVRo3u2XvQrCMBgAT9FJEAqu4vO4+BgOvrSv4NjJOgm10Gp/vwTv4JuSkLtsAREREelkBxTAKlqkLw+gqs1hjkvW0ZUGRAsYEC1gQLSAAdECBkQLGBAtYEC0wN8HbEacPQLbjvXm45yAfcveCrgvHX8GSj5/XUPmCdyWlp8qIlR+bEQS8kMjkpLvG5Gk/K8RSct/i8hCvi0iK/lmRJbyby7ANVpCRERE5uIFO9pmz/tN+9wAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDktMjdUMTE6MDE6MzcrMDA6MDAxOTC9AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA5LTI3VDExOjAxOjM3KzAwOjAwQGSIAQAAAABJRU5ErkJggg==',
                    title: 'Selenct down',
                    disabled: function () { return _this.disabledDown() },
                    action: function () { _this.down() }
                },
                copy: {
                    name: 'copy',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAA7klEQVRo3u2ZSw6CMBRFj4apcQMyZu0aEscO3JGagAvAATqQQOTTvlfiPQmTQuk9bdKXtCDSJAdKoAaayE+U8HeD4NEESsPwiwU2PW01sIsxMxMyLOrcjPgmGbbeASTgHcBLwKJO1MAZKKaG+7XNWdeJx3vMYALWdaIBTkNh52yj1nXiM+Y+lIBVnRg1zt/uQskgAW8k4I0EvJGANxLwRgLeSMAbCXizeoGspy3ps9Auq18BCXgjAW8k4E02o8+T78PdKFelHaqhF3NW4GoQuMsl5M8K2ksHq7uBG3AIPSM57aVDFTF4BRxjhBcheQHmPezLx9HoXgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0yN1QwNDozOTozNCswMDowMArEXrAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMjdUMDQ6Mzk6MzQrMDA6MDB7meYMAAAAAElFTkSuQmCC',
                    title: 'Copy',
                    disabled: function () { return _this.disabledCopy() },
                    action: function () { _this.copy() }
                },
                cut: {
                    name: 'cut',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAB9klEQVRo3u2YTU7CQBiGHzHqCgzXELmAceERSIhncUndGRFTAtHD+BNdeAAFI3HJDQSXGFxMScgU2pnOtDOLvskkJP2m87ztVzp9oVSpUmlqAn1gDPxGYwyEwLFruCQdAHfAH7DcMhbAENh3DbsJ/jkBXB5Plk0ECWsp6V4DfjUGBcArGWgSb5sp0Aaq0WgBE+Lt1MgZPlA5SShN+gLqG+rqkbH12lvX8ACf0sRWQu25VDtyDQ8wkyZXE2prUu3MNbyugUOp9sc1POi1UFuq/XAND/GHeML2h/hbqr12DQ9ie7CQTjhFPLC1aLQ3wC+Bnmv4lYYpi2QFKAQexLbg0bKJwuDXTQyIt1NWE4FGrVU1EG/YETBH/FW+A11Ez5uayBVeRRcpJq4S6jumi+9aMPAG7ABnW46fRsdfpPpX4NLWVbQh3TvhpQIJ+gRxB3Lr90rOhiqIdlmpk4cJWwpQ/4v1rp104L0zkQW+UBNyLjRDvNRuUHuRpRkM8gJXyYVUwQo3oZsLebeZy5ILebOdzpoLefNBE0on1MmFuopr5GrCJBfy4qPeJBfyIlYxyYW8CLZMciEvosVQmqyTC3kR7mbNhRbAkYEBqyay5EJ9Q3hVE0rSzYUegD1LBtJMKEslF1ogrrxNeOuSc6F59LuHec+XKlXKUP835G8IanS10wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0yN1QwNDo0MDowNCswMDowMFFlZxoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMjdUMDQ6NDA6MDQrMDA6MDAgON+mAAAAAElFTkSuQmCC',
                    title: 'Cut',
                    disabled: function () { return _this.disabledCut() },
                    action: function () { _this.cut() }
                },
                paste: {
                    name: 'paste',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABG0lEQVRo3u2ZzWrCUBBGj9WtUNc1a99KfT1F6KYoXbgVq6+iQiK4TRcmoGKS3h/7WToHZhHIzP0OCVlkID4dYAxsgVNRG2AEtB9wXlR6wBeQV9QaeFWHrKLdEL6sFfCiDnuP8Q/ClzX8rVAJMAMyh3BlfQBvQB+Ye/RnwDswCAm/9zi4rP7NLN85h6LfmVnAoTEFcmDqI+Dz2lzWvJBIgEXgrLQqZKtGIG+4NycuTfPvZn3Kz5kLJqDGBNR0AnpbAb3R+PNPwATUmIAaE1BjAmpMQI0JqDEBNSagxgTUmIAaE1BjAmrq/swdge7Fdex9gAuVC466J7AUBr7l06dpwHnBFrIailE7rvdtTiScF2ypIHgKTELCG8Z/4BuHD+VLGLARSgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0yN1QwNDozOTo1MCswMDowMDjkcyQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMjdUMDQ6Mzk6NTArMDA6MDBJucuYAAAAAElFTkSuQmCC',
                    title: 'Paste',
                    disabled: function () { return _this.disabledPaste() },
                    action: function () { _this.paste() }
                },
                link: {
                    name: 'link',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAADHElEQVRo3u2ZzUsUYRzHP7uBSh0qLTtUKKuBQdGpOkSkFBQEnZLqYJEQBL0IEkT0B1QQhYc6mG1u18B7eRGtSxHUUahs7WZrmEX4Eurh2YHxO2+77szOCvuFYXlmvvP7fZ6Z53n2eZ6Bqqqqal0rEVPeOuAo0AQ0ADngO/AWmI/7ofgpBWSAv8Cyy/EHSAPNcYO6qRdY8ADXYx64HjewpSTwrEBwPfqCgm8oA3wa6Ha59g0YAoaBL0A9sFk8hzH940PEnJ7wgzifag7oxDmAJIEuYEb8c5jOXhHwk0BrwL37XSrxvFLgUwXG6JJ7Z4GacsFnSoS34mQlRsd6gbf0QuK4DQQkQ6zAAHBRzv0A2jEjTrGaknJDlBW4DVwOER5gu5R/hcTq0D7gP4U1mx3AAYIfXAKYoEx9YEgSTQEtLr5TwL+85zX+o8oFnKNQbRTw9cCiJDvt4R0WX7+HrxWYFm86CniA85Loo4/3Kc4R6ph4GjDTap3YNUdVgbuS7J6PdwswLv5R8WzKA9s9N8OCTQJtcu6xJOsJiHEIWLL5l4Cd4hkluJmtgioUPg2ck/O/pbw1IM57YMxWTgAnxPM5/5sBroZRAQv+EqbT2pWVcnsB8UakrDPN6Tx8N+YNlSz7YkST78LZJA4GxOthdbN7JNfbCHGG0CvJ5oCN4hkTzzimw3rpgfjvhAWrSuFcw04C28TXgXN4fOIT95N4z0ZVAZ1Z5vBejOia942H74z4FvB/W2tWHc6tj04ffw1merCMmS6cdPG0AD8l5qso4MEMbfZEXwneBEtiJmqNLtdSmOZnj7kI7I2qAlck2UAJsdzgl4FbYYB6DVf6h5QrAX4E2C3n08DDKCugi4fGoEBFwL/EvOFIdZzVrztLcX8uXs0mU2ScNasWs9FqT95VIvxgueAtpQVgBrPp5Kc9lQIPZhGhc/MZzM6DwiQwy0BdScUGb+mGC5DVJwaB+5j9mwkPX6zwlvo84IKO/kqAt3QNMxMt9ONEaMvAMNWE2SWe9QCP5fPQWj7y1QBH8qCNmH2gLPCOCv9AV1VVVVWgVgAPDHRgefYM4AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxNDo1OTozMiswMDowMOFciqoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTQ6NTk6MzIrMDA6MDCQATIWAAAAAElFTkSuQmCC',
                    title: 'Link',
                    disabled: function () { return _this.disabledLink() },
                    action: function () { _this.editLink() }
                },
                image: {
                    name: 'image',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABzUlEQVRo3u2ZyUrDUBSGvzosxLEqqAj6AKJvIK58AKdncOXeCUdc+BKiILoQhYLgwpUg4hOIIu4UdyotKDi0LpJLQ8hNk7S9p4X7wYHCPWn+L0N7cwMWWRqr/P0bwARwJS2aNHzBrTXpMHHZdIN/u1UAVqRDJQk/BUx7JFalw8UNr5ihDs6ELrxiFvhxe5alw/rZKhE+SGJJOnTc8Io5j8RiuTtPlRgfBNaBcaBPs32X+/kXyEXcbwfF/6B3TU8OyODc+NkkcsPAM8Xfcql69BykWJzUQHhVe7qQYZdQFmhPYl4FPoB03I38R8EkvVH332A4WMWxAtJYAWmsgDRWQBorII0VkKbSAmmgW1pKkWQ6fQZcUv6SZeTpdCUFFjy9OyV6Sz2LGxcYA748vXmcJZQg+oFroKdWBNqA+4D+HDDi620Bbt3xc/T3oFGBQ/QP4w9Ap9uXAo5847oVOmMC8yHhVWXc8NsBY3/ApJTAKPAZQUBdLnnN2CswYFqgFbiLGD5K3QDNJgX2Kxhe1a5JgWpj14XqhroXaAoZy+Ks4ytM3wdedO8QQs/AhWBgP6dJNhoCXpB/N/BEcTqSSOIYZ33edPA34ABn9mqpWf4B0/l4sgdYXjsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDktMTZUMTU6MDE6MTUrMDA6MDDZyIZqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA5LTE2VDE1OjAxOjE1KzAwOjAwqJU+1gAAAABJRU5ErkJggg==',
                    title: 'Image',
                    disabled: function () { return _this.disabledImage() },
                    action: function () { _this.editImage() }
                },
                head: {
                    name: 'head',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAADI0lEQVRo3u2ZT09TQRTFf4KtCRBNwJIodK0LdwgWd+BnMBDdgaisCYluXAqu1QBxSeKfGFeKSz6AAZMaNzRxYQWbKC6gKGWhdTGvyePOtH3TzrQYe5JZzOvMmXPfu3PvnSm00ML/jWOOeNqBIWAEGADOA2eAruD3PeArsAGsA6vAO+BPs19AEpgHNoGiZfsCzAH9zRCeAJaAgxqEy3YALACnGyX+GvDDgXDZtoFxn8JjwJMKAnaAp8ANYDD4SrGgJYJnU8AzYLcCz2Iwxyk6gLdlFtwAJoIxNnyTQKYM54olX9U3bxL/C5gBjtfJPQvsG/jf4OhLmNwmA1xw9YaAFCrMynUW6iW+biB9j/Jp1+gH0ob1xmolTKBHm4wn8WEjcmLN70BPLWRL6D7v0m3KIQUUxNqPbUmS6ElqpgHiS7gn1i5gmbHn0UNlPdHGFl3orjQXdXI7em0z0UDxJUwLDVmgLcrEYTFxB4dJxQKdQF5oGZKDTBaNiP4KagM3Gj+DtcMYjWLAgOivNkF8ubWlNqMB50Q/Lfpx4AEqc26hNnzc0xi5ttRmhExesk6XEaoYPPMxphc9qVWFjP/yrZhqlpynMSfQ88EhRApLAkXDs9+exlSFyYA90T8p+suGOcuexpwS/XwUoz5SOfbGUb66ReUN6mJMSmj5EMWAV2LSVJRJnnBLaHkpB5hcaE30R2kerlTRZoT8bLscnVJiMMrENtSlU3jiZBMMmBIaPmMRNefE5AwerjoqIA58Ehru2xD0oye02QYacAc9gfXZkiwIkn3U/vCNy+hHyoe1EHWjag+Z6pMexZ9FP0xtU8e96Th6vZLGz41yEpWo5HpX6yVeNJDmcOtOw+hn4CLwyAV5DHUykuQF1O1BZx3cceAuus8Xgdc4vEjoKGNE6WtMWxrSCdxED5Vh8c6TZww9MoVbHniOql8uoQ4j8aD1Bs9uAy/QM6x0G69XOGPo0clF+4aDDRsVPajrPpPv2rYCKs53N0p8GH2osiNbg/AsqjywzrBhuPqbtQ24iCq9B1C3B30c/pt1E1VTraGuS9Y5An+zttDCv46/K53XmFVUFdIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDktMjRUMDc6MTM6NTQrMDA6MDAX56YDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA5LTI0VDA3OjEzOjU0KzAwOjAwZroevwAAAABJRU5ErkJggg==',
                    title: 'Edit head',
                    disabled: function () { return _this.disabledHead() },
                    action: function () { _this.editHead() }
                },
                save: {
                    name: 'save',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABXElEQVRo3u2ZMU7DQBAAJwjhVHyA0KGInoJPAfkCJR+hAsQDEC1JqkDDL0BKTE0oHCQU2T77srtnix3pKq9vd3zrs04Gx3GcLnMKPAIrYK08rqWLPwY+DQpXk7g3Ll5cwqJtVCW2J9XijPJWvemLgJpElYBUm6hLWAuIS6QQqJPojQDAedP4QUCgLFbqhR4Erq+bxO8JFZMMF0jNfsQ9od41pfcr4AKp0RAYAhNgDnxtxgy4AjJLuZhP+Qh4o/rr+7qJ0cq/0wTDQPF/JZqshLnApEHxv+OyiwLzFgLTLgrkLQRyqfypttFvqYkkBd6VYs0EbpVio2n7DmQUW2So/xfAgUJ+kQlGAYkFcKSYX2SCjGKfn1LsNjnwAlzQ7Mm3yh9zJrbif5yJ605kK+Cw5olYsqy6ULcCzwkL3uYp5qYx9j84ysYHcBJrPgYeKJbQuvAlcLdL8Y7jOPr8ALb40CVRgUo/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA5LTE2VDE0OjU4OjU2KzAwOjAwPL7MAAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wOS0xNlQxNDo1ODo1NiswMDowME3jdLwAAAAASUVORK5CYII=',
                    icon2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAABvklEQVRo3u2Zu0oDQRSGv0jUWKigTZAIYiH2Bn0FOx/AQiSVVV4hpYiVta3YeEGsLSwEo40+gRcQO4MXtIzF7uKyzGSzs3NmDcwPU+25/N/mZGaXBS8vL6//rEXgFPgAusKrZdv8LPDmwLgYxJFj89YhXIyNKESyqJSWUI/q9qAAiEHoAGyNiTiEawDrEEUA9IIYGACAlX7jSykAqlhbf+hSyvVuP/FDlswUJg9QtMoGOWmz61QD/wt4gKIlAVABmkAb+ArXNbAFjGSo85rXiMlRXgPu0Z++hxn6jwIN4DlD/1wAlRTzB8C4gY9p4NwFQLOH+V3ybb9GuVkB2ujvfCFnR1aAT0XOIzBh2L/qGuBbkbNu2LtO8E5gmm8EcJuIf8Jsm64DnbDGD7DsCmAzEW/yGhg3H60rVwBl4CYWv6qJm8lg/gGYcwUAMMXfblRTXG+FJuvS5k0BIJj7DWBYYT6qFYcQMZ8HQKedRL0OwaOCiHkJgBKwr6ib3LnmbZgHeE9plrbWFDXLwJkm3tqdj3SSE2BPU3cMuJQ2D7BAvg8cLwSPxCpNAneS5uMQx5iPU6NH7SpwIWney8vLS16/eT7oBHxeUFYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDktMTdUMTY6Mjk6NTQrMDA6MDCj7IdOAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA5LTE3VDE2OjI5OjU0KzAwOjAw0rE/8gAAAABJRU5ErkJggg==',
                    title: 'Save',
                    disabled: function () { return _this.disabledSave() },
                    action: function () { _this.save() }
                }
            },
            draggerIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABgAAAAYADwa0LPAAAA+klEQVRo3u3ZUQ7CIBAE0NGDGOL9r+SHJ6k/bWJIkV3KDrvCJHx3XgwsrcDKiuukfYXMA8ALwBvAc3SZ1vLbvkIh8vKhEKXyIRC18q4R0vIuEdryrhCt5bshboa4jfGsuyGAkukAidDJ7BnHhpUm37DSmJxO36eNNaD7EZsflQxAN8TZOc8CXEaUhhQT0Iz4NWHZADXi6vXAaokQXssXEeEn8Vm8/grd9oE0wzZxDcEGdJ8FTIDJNGYBzO5DDIDpjdQaYPqynwgAzTPWS/3wTA/QTOy/+zrnonwrwlV5LcJleSnCdfkaIkT5EiJU+RwRsvyRhMB/dK9MkQ9aiYmYo9JGZAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wOS0xNlQxMjoyOTo1MSswMDowMJ8FU+4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDktMTZUMTI6Mjk6NTErMDA6MDDuWOtSAAAAAElFTkSuQmCC'
        }

        this.options = this.deepMerge(defaults, options);
        this.options.groupingHistory = this.options.groupingHistory / 10000;

        /*
            <div id="ncsedt-implement">:
                The code to run the editor, the developer or user of the editor creates it. There can only be one.

            <ncsedt-editable id="ncsedt-editable">:
                Container that creates this script for editable HTML. Internal use of this application.

            Initial tree (editable = 'body'):

                html
                |-- head
                `-- body (editable)
                    |-- body content ...
                    `-- ncsedt-implement
                        `-- new ncSimpleHtmlEditor()

            Necessary tree:

                html
                |-- head
                `-- body
                    |-- ncsedt-editable (editable)
                    |   `-- body content ...
                    `-- ncsedt-implement
                        `-- new ncSimpleHtmlEditor()

            Initial tree (editable = 'div'):

                html
                |-- head
                `-- body
                    |-- div (editable)
                    `-- ncsedt-implement
                        `-- new ncSimpleHtmlEditor()

            Necessary tree:

                html
                |-- head
                `-- body
                    |-- ncsedt-editable (editable)
                    |   `-- div
                    `-- ncsedt-implement
                        `-- new ncSimpleHtmlEditor()

            Then:
                - The highest node that can be editable is body.
                - Wrap editable in ncsedt-editable.
                - Ensure that the implement is the last child of the body.

         */


        /*
         * Determines if the editing is active, can be true/false.
         */
        this.editEnable = null;

        /*
         * Private clipboard, does NOT share data with other applications.
         */
        this.clipboard = null;

        /*
         * <ncsedt-editable id="ncsedt-editable">
         */
        this.editable = document.querySelector(this.options.editable);
        this.editableInBody();
        this.wrapEditable();

        /*
         * <div id="ncsedt-implement">
         */
        this.implement = document.querySelector('#ncsedt-implement');
        this.implementToLastBody();

        /*
         * Default focus to editable
         */
        this.focused = this.editable;
        this.focusedPrev = this.focused;

        /*
         * Observer
         */
        this.observer = this.setObserver();

        /*
         * undo/redo history
         */
        this.historyUndo = [];
        this.historyRedo = [];
        this.historyForce = [];

        /*
         * Events that must be available before "start".
         */
        this.setEventEditorChanges();
    }

    ncSimpleHtmlEditor.prototype.deepMerge = function (target, source) {
        for (key of Object.keys(source)) {
            if (!target.hasOwnProperty(key) || typeof source[key] !== 'object') {
                target[key] = source[key];
            } else {
                this.deepMerge(target[key], source[key]);
            }
        }

        return target;
    }

    /**
     * Determine if editing is active, true/false
     */
    ncSimpleHtmlEditor.prototype.isEditEnable = function (target, source) {
        return this.editEnable;
    }

    /**
     * Get the current element that has the focus.
     */
    ncSimpleHtmlEditor.prototype.getFocused = function (target, source) {
        return this.focused;
    }

    /**
     * Get the previous element that had the focus.
     */
     ncSimpleHtmlEditor.prototype.getFocusedPrev = function (target, source) {
        return this.focusedPrev;
    }

    /**
     * Get editable element.
     */
     ncSimpleHtmlEditor.prototype.getEditable = function (target, source) {
        return this.editable;
     }

    /**
     * Get clipboard content, can be null.
     */
    ncSimpleHtmlEditor.prototype.getClipboard = function (target, source) {
        return this.clipboard;
    }

    /**
     * The highest node that can be editable is body
     */
    ncSimpleHtmlEditor.prototype.editableInBody = function () {
        if (this.editable.contains(document.body) && this.editable != document.body) {
            console.log('The highest node that can be edited is body, set options.editable = "body"');
            this.options.editable = 'body';
            this.editable = document.querySelector(this.options.editable);
        }
    };

    /**
     * Wrap editable content/innerHTML
     */
    ncSimpleHtmlEditor.prototype.wrapEditable = function () {
        const wrapContent = (target, wrapper = document.createElement('ncsedt-editable')) => {
            ;[ ...target.childNodes ].forEach(child => wrapper.appendChild(child))
            target.appendChild(wrapper);
            return wrapper;
        }

        this.editable = wrapContent(this.editable);
        this.editable.id = "ncsedt-editable";
        this.editable.setAttribute("contentEditable", "true");
    };

    /**
     * Separate the editor code from the editable content,
     * preventing the code from being part of the editable content.
     */
    ncSimpleHtmlEditor.prototype.implementToLastBody = function () {
        var implement = document.createDocumentFragment();
        implement.appendChild(this.implement);
        document.body.appendChild(implement);
        this.implement.insertAdjacentHTML('beforeend', '<div id="ncsedt-container"></div>');
        this.implement.insertAdjacentHTML('beforebegin', '<!-- ncsedt-implement:begin -->');
        this.implement.insertAdjacentHTML('afterend', '<!-- ncsedt-implement:end -->');
        this.container = document.getElementById('ncsedt-container');
        this.container.insertAdjacentHTML('beforebegin', '<!-- ncsedt-container:begin -->');
        this.container.insertAdjacentHTML('afterend', '<!-- ncsedt-container:end -->');
    };

    /**
     * Start the editor, the editorstart event is called at the end.
     */
    ncSimpleHtmlEditor.prototype.start = function () {
        this.editOff();
        this.tollbar = this.renderTollbar();
        this.dialogCode = this.renderDialogCode();
        this.dialogImage = this.renderDialogImage();
        this.dialogLink = this.renderDialogLink();
        this.dialogHead = this.renderDialogHead();
        this.movable('#ncsedt-toolbar', '#ncsedt-toolbar-dragger');
        this.movable('#ncsedt-dialog-code', '#ncsedt-dialog-code .dragger');
        this.movable('#ncsedt-dialog-image', '#ncsedt-dialog-image .dragger');
        this.movable('#ncsedt-dialog-link', '#ncsedt-dialog-link .dragger');
        this.movable('#ncsedt-dialog-head', '#ncsedt-dialog-head .dragger');
        this.setEvents();
        this.setEventsToolbar();
        this.setEventsDialogCode();
        this.setEventsDialogImage();
        this.setEventsDialogLink();
        this.setEventsDialogHead();
        document.dispatchEvent(new Event("editorstart"));
    };

    /**
     * Activate editing, set this.editEnable=true which allows you to
     * desterminate if the editor is active
     */
    ncSimpleHtmlEditor.prototype.editOn = function () {
        var btnsEdit = document.querySelectorAll('.ncsedt-toolbar-btn-edit img');
        this.editable.setAttribute("contentEditable", "true");

        for (element of btnsEdit) {
            element.src = this.options.buttons.edit.icon2;
        }

        this.editEnable = true;
        this.setFocus(this.focused);
        this.observe();
        document.dispatchEvent(new Event("editorchanges"));
    };

    /**
     * Deactivate editing, set this.editEnable=false which allows you to
     * desterminate if the editor is deactivated
     */
    ncSimpleHtmlEditor.prototype.editOff = function () {
        this.observer.disconnect();
        var editable = document.querySelectorAll('*[contentEditable]');
        var btnsEdit = document.querySelectorAll('.ncsedt-toolbar-btn-edit img');

        for (element of editable) {
            element.setAttribute("contentEditable", "false");
        }

        for (element of btnsEdit) {
            element.src = this.options.buttons.edit.icon;
        }

        for (focused of document.querySelectorAll(".focused")) {
            focused.classList.remove('focused');
        }

        this.editEnable = false;
        document.dispatchEvent(new Event("editorchanges"));
    };

    /**
     * Sets the focus on the element currently being edited.
     * Receives the element on which the focus will be set.
     */
    ncSimpleHtmlEditor.prototype.setFocus = function (element) {
        if (!this.editEnable) {
            return;
        }

        if (!element) {
            return;
        }

        if (!element.isContentEditable) {
            return;
        }

        for (oldfocused of document.querySelectorAll(".focused")) {
            oldfocused.classList.remove('focused');
        }

        this.focusedPrev = this.focused;
        this.focused = element;
        this.focused.focus();
        this.focused.classList.add('focused');
        document.dispatchEvent(new Event("focusedchange"));
    };

    /**
     * Download html with the current changes.
     * You may need to replace this function with your own.
     */
    ncSimpleHtmlEditor.prototype.save = function () {
        var _this = this;
        var templatesource = this.getDocumentHTML();
        var download = document.createElement('a');
        var btnsSave = document.querySelectorAll('.ncsedt-toolbar-btn-save img');
        this.saving = true;
        this.editOff();

        for (button of btnsSave) {
            button.src = this.options.buttons.save.icon2;
            button.parentNode.disabled = true;
        }

        download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(templatesource));
        download.setAttribute('download', 'index.html');
        this.container.appendChild(download);
        download.click();

        setTimeout(function () {
            _this.saving = false;
            for (button of btnsSave) {
                button.src = _this.options.buttons.save.icon;
                button.parentNode.disabled = false;
            }
        }, this.options.saveTimeout);

        this.container.removeChild(download);
        this.editOn();
    };

    /**
     * Get the HTML with the current changes.
     * If no selector is indicated, the complete document.
     */
    ncSimpleHtmlEditor.prototype.getDocumentHTML = function (selector = null) {
        var html = '';
        var result = '';

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });

        if (selector) {
            html = document.querySelector(selector).innerHTML;
        } else {
            html = new XMLSerializer().serializeToString(document);
        }

        result = this.ncsedtRemover(html);

        return result;
    };

    /**
     * Removes the code from the HTML editor.
     */
    ncSimpleHtmlEditor.prototype.ncsedtRemover = function (html) {
        var result = html.replace(/(<!-- ncsedt-implement:begin -->.*<!-- ncsedt-implement:end -->)|(<!-- ncsedt-container:begin -->.*<!-- ncsedt-container:end -->)|(<\/?ncsedt-editable[^>]*>)/gsi, '');

        return result;
    };

    /**
     * Editing on/off
     */
    ncSimpleHtmlEditor.prototype.editToggle = function () {
        if (this.editEnable) {
            this.editOff();
        } else {
            this.editOn();
        }
    };

    /**
     * Undo
     */
    ncSimpleHtmlEditor.prototype.undo = function () {
        this.undoredo(true);
    };

    /**
     * Redo
     */
    ncSimpleHtmlEditor.prototype.redo = function () {
        this.undoredo(false);
    };

    /**
     * Focus on parent
     */
    ncSimpleHtmlEditor.prototype.up = function () {
        if (this.focused.parentElement) {
            this.setFocus(this.focused.parentElement);
            this.focused.scrollIntoView({ block: "center" });
        }
    };

    /**
     * Focus on first child
     */
    ncSimpleHtmlEditor.prototype.down = function () {
        if (this.focused.firstElementChild) {
            this.setFocus(this.focused.firstElementChild);
            this.focused.scrollIntoView({ block: "center" });
        }
    };

    /**
     * Current focus to clipboard
     */
    ncSimpleHtmlEditor.prototype.copy = function () {
        if (this.focused != this.editable) {
            this.clipboard = this.focused.outerHTML;
            document.dispatchEvent(new Event("editorchanges"));
        }
    };

    /**
     * Cut current focus
     */
    ncSimpleHtmlEditor.prototype.cut = function () {
        if (this.focused != this.editable) {
            this.clipboard = this.focused.outerHTML;
            this.focused.parentElement.removeChild(this.focused);
            this.setFocus(this.focused.parentElement);
        }
    };

    /**
     * Paste clipboard content
     */
    ncSimpleHtmlEditor.prototype.paste = function () {
        if (this.clipboard && this.focused != this.editable) {
            this.focused.insertAdjacentHTML('afterend', this.clipboard);
        }
    };

    /**
     * When the edit button is disabled, never
     */
    ncSimpleHtmlEditor.prototype.disabledEdit = function () {
        return false;
    };

    /**
     * When the save button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledSave = function () {
        if (this.editEnable && !this.saving) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the undo button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledUno = function () {
        if (this.editEnable) {
            if (this.historyUndo.length) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    /**
     * When the redo button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledRedo = function () {
        if (this.editEnable) {
            if (this.historyRedo.length) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    /**
     * When the up button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledUp = function () {
        if (this.editEnable && this.focused.parentElement && this.focused.parentElement.isContentEditable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the down button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledDown = function () {
        if (this.editEnable && this.focused.firstElementChild) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the cut button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledCut = function () {
        if (this.editEnable) {
            if (this.focused == this.editable) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    /**
     * When the copy button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledCopy = function () {
        if (this.editEnable) {
            if (this.focused == this.editable) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    /**
     * When the redpasteo button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledPaste = function () {
        if (this.editEnable && this.clipboard && this.focused != this.editable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the link button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledLink = function () {
        if (this.editEnable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the image button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledImage = function () {
        if (this.editEnable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the head button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledHead = function () {
        if (this.editEnable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * When the code button is disabled
     */
    ncSimpleHtmlEditor.prototype.disabledCode = function () {
        if (this.editEnable) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Observer.
     * Main use is undo/redo history
     */
    ncSimpleHtmlEditor.prototype.setObserver = function () {

        /*
            The edited template may change attributes for design reasons,
            class changes in nav, menus, etc.

            Only mutations that originate from the element being edited
            (_this.focused.contains(mutation.target)) are added to the
            history for "attributes".

            Only the changes forced by the application (historyforce) are
            added to the history for "attributes".
        */

        return new MutationObserver(function (mutations) {
            if (!_this.editEnable || _this.ignoreMutations) {
                return;
            }

            mutations.forEach(function (mutation) {

                // Time to group mutations.
                mutation.time = Date.now() / 10000;

                switch (mutation.type) {
                    case 'characterData':
                        mutation.newValue = mutation.target.nodeValue;
                        _this.historyUndo.push(mutation);
                        document.dispatchEvent(new Event("contentchanges"));
                        break
                    case 'attributes':
                        var attrName = mutation.attributeName;
                        var attrValue = mutation.target.getAttribute(mutation.attributeName);
                        if ((_this.focused.contains(mutation.target) || document.head.contains(mutation.target)) && _this.historyForceCheck(attrName, attrValue)) {
                            mutation.newValue = attrValue;
                            _this.historyUndo.push(mutation);
                            _this.historyForceRemove(attrName, attrValue);
                            document.dispatchEvent(new Event("contentchanges"));
                        }

                        break
                    case 'childList':
                        _this.historyUndo.push(mutation);
                        document.dispatchEvent(new Event("contentchanges"));
                        break
                }
            });

            document.dispatchEvent(new Event("editorchanges"));
        });
    };

    /**
     * Activate the observer.
     * For editable, head if button head is present in tootlbar.
     */
    ncSimpleHtmlEditor.prototype.observe = function () {
        this.observer.observe(this.editable, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });

        if (this.options.toolbar.includes('head')) {
            this.observer.observe(document.head, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            });
        }
    };

    /**
     * Attributes require authorization for mutations.
     * Attribute name and value.
     */
    ncSimpleHtmlEditor.prototype.historyForcePush = function (attr, val) {
        var force = attr + ':' + val.toString();
        this.historyForce.push(force);
    };

    /**
     * Check an attribute change.
     * Attribute name and value.
     */
    ncSimpleHtmlEditor.prototype.historyForceCheck = function (attr, val) {
        var value = val || '';
        var force = attr + ':' + value.toString();
        return this.historyForce.includes(force);
    };

    /**
     * You should not call this function.
     */
    ncSimpleHtmlEditor.prototype.historyForceRemove = function (attr, val) {
        var force = attr + ':' + val.toString();

        if (this.historyForce.includes(force)) {
            this.historyForce.splice(this.historyForce.indexOf(force), 1);
        }
    };

    /**
     * undo/redo action, undo if undo=true, else redo.
     */
    ncSimpleHtmlEditor.prototype.undoredo = function (undo) {
        this.observer.disconnect();
        var previousTime = null;
        var groupingByTime = true; // always true, only for readability

        /*
            The editor can cause several mutations that correspond to a single
            update, mutations performed at the same time or in a margin of
            "groupingHistory" time correspond to the same update.
        */
        while (groupingByTime) {
            if (undo) {
                if (!this.historyUndo.length) {
                    break;
                }

                var mutation = this.historyUndo.pop();
                this.historyRedo.push(mutation);

                if (previousTime && mutation.time + _this.options.groupingHistory < previousTime) {
                    /**
                     * End group, restore and break
                     */
                    this.historyUndo.push(mutation);
                    this.historyRedo.pop();
                    break;
                }
            } else {
                if (!this.historyRedo.length) {
                    break;
                }

                var mutation = this.historyRedo.pop();
                this.historyUndo.push(mutation);

                if (previousTime && mutation.time - _this.options.groupingHistory > previousTime) {
                    /**
                     * End group, restore and break
                     */
                    this.historyRedo.push(mutation);
                    this.historyUndo.pop();
                    break;
                }
            }

            switch (mutation.type) {
                case 'characterData':
                    var parentView = mutation.target.parentElement.parentElement.parentElement || mutation.target.parentElement.parentElement || mutation.target.parentElement
                    parentView.scrollIntoView({ block: "center" });
                    this.setFocus(mutation.target.parentElement);
                    mutation.target.textContent = undo ? mutation.oldValue : mutation.newValue;
                    break;

                case 'attributes':
                    mutation.target.scrollIntoView({ block: "center" });
                    this.setFocus(mutation.target);
                    var value = undo ? mutation.oldValue : mutation.newValue

                    if (value === null) {
                        mutation.target.removeAttribute(mutation.attributeName);
                    } else {
                        mutation.target.setAttribute(mutation.attributeName, value);
                    }

                    break;

                case 'childList':
                    mutation.target.scrollIntoView({ block: "center" });
                    this.setFocus(mutation.target);
                    var addNodes = undo ? mutation.removedNodes : mutation.addedNodes;
                    var removeNodes = undo ? mutation.addedNodes : mutation.removedNodes;

                    Array.from(addNodes).forEach(mutation.nextSibling ? (node) => {
                        mutation.nextSibling.parentNode.insertBefore(node, mutation.nextSibling);
                    } : (node) => {
                        mutation.target.appendChild(node);
                    });

                    Array.from(removeNodes).forEach(function (node) {
                        node.parentNode.removeChild(node);
                    });

                    break;
            }

            previousTime = mutation.time;
        }

        this.observe();
        document.dispatchEvent(new Event("editorchanges"));
        document.dispatchEvent(new Event("contentchanges"));
    };

    /**
     * When there are changes.
     */
    ncSimpleHtmlEditor.prototype.setEventEditorChanges = function () {
        var _this = this;

        document.addEventListener('editorchanges', function () {
            _this.setDisabledBtns();
        });
    };

    /**
     * Generic events.
     */
    ncSimpleHtmlEditor.prototype.setEvents = function () {
        var _this = this;

        this.editable.addEventListener('click', function (evt) {
            if (_this.focused != evt.target) {
                _this.setFocus(evt.target);
            }
        }, true);

        this.editable.addEventListener('input', function (evt) {
            // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
            if (evt.inputType == "insertParagraph") {
                setTimeout(function () {
                    _this.setFocus(document.getSelection().anchorNode);
                }, 50);
            }
        }, true);

        this.editable.addEventListener('dblclick', function () {
            if (_this.focused.tagName == 'A' || _this.focused.parentElement.tagName == 'A') {
                _this.command(_this.options.buttons.link);
            } else if (_this.focused.tagName == 'IMG' || _this.focused.parentElement.tagName == 'IMG') {
                _this.command(_this.options.buttons.image);
            } else {
                _this.command(_this.options.buttons.code);
            }
        }, true);

        document.addEventListener('contentchanges', function () {
            window.onbeforeunload = function (evt) {
                evt.returnValue = '';
                return '';
            };

            if (_this.options.linearHistory && _this.historyRedo.length) {
                _this.historyRedo = [];
            }
        });

    };

    /**
     * Toolbar events.
     */
    ncSimpleHtmlEditor.prototype.setEventsToolbar = function () {
        _this = this;

        for (var name of this.options.toolbar) {
            var button = this.options.buttons[name];
            var toolbarBtns = document.querySelectorAll(".ncsedt-toolbar-btn-" + button.name);
            for (btn of toolbarBtns) {
                btn.addEventListener('click', handleCommand(button));
            }
        }

        function handleCommand(button) {
            return function (e) {
                _this.command(button);
            };
        }
    };

    /**
     * Execute a command, usually from the toolbar.
     */
    ncSimpleHtmlEditor.prototype.command = function (command) {
        command.action();
    };

    /**
     * Set handler for disabled buttons
     */
    ncSimpleHtmlEditor.prototype.setDisabledBtns = function () {
        for (var name of this.options.toolbar) {
            var option = this.options.buttons[name];
            var buttons = document.querySelectorAll(".ncsedt-toolbar-btn-" + option.name);
            for (button of buttons) {
                button.disabled = option.disabled();
            }
        }
    };

    /**
     * Set an element as movable.
     */
    ncSimpleHtmlEditor.prototype.movable = function (movableSelector, draggerSelector) {
        new ncSimpleMoveable(movableSelector, draggerSelector);
    };

    /**
     * Render toolbar
     */
    ncSimpleHtmlEditor.prototype.renderTollbar = function () {
        var toolbar = document.createElement("toolbar");
        toolbar.id = "ncsedt-toolbar";
        toolbar.classList.add("ncsedt-toolbar");

        toolbar.innerHTML =
            '<button class="ncsedt-toolbar-dragger ncsedt-toolbar-btn" id="ncsedt-toolbar-dragger">' +
            '   <img class="ncsedt-toolbar-icon-dragger ncsedt-toolbar-icon" src="' + this.options.draggerIcon + '" title="Move">' +
            '</button>';

        for (var name of this.options.toolbar) {
            var option = this.options.buttons[name];
            var button = document.createElement("button");
            button.classList.add("ncsedt-toolbar-btn");
            button.classList.add("ncsedt-toolbar-btn-" + option.name);
            button.disabled = option.disabled();
            button.innerHTML = '<img class="ncsedt-toolbar-icon" src="' + option.icon + '" title="' + option.title + '">';
            toolbar.append(button);
        }

        this.container.append(toolbar);

        if (this.options.toolbarCols) {
            var style = window.getComputedStyle(toolbar);
            var padding = parseInt(style.getPropertyValue('padding'));
            var border = parseInt(style.getPropertyValue('border'));
            toolbar.style.width = (42 * this.options.toolbarCols + (padding * 2) + (border * 2)) + 'px';
        }

        return toolbar;
    };

    /**
     * Edit source code dialog
     */
    ncSimpleHtmlEditor.prototype.renderDialogCode = function () {
        var _this = this;
        var dialogCode =
            '<dialog id="ncsedt-dialog-code" class="ncsedt-dialog">' +
            '    <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton dragger"><img class="" src="' + this.options.draggerIcon + '" title="Move"> <span>Edit source code</span></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton cancel"> <b>&Cross;</b> </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="body">' +
            '       <textarea class="code sbutton" placeholder=" ( empty ) "></textarea>' +
            '   </div>' +
            '   <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton parent">&Uparrow;</button>' +
            '           <button type="button" class="sbutton child">&Downarrow;</button>' +
            // '           <button type="button" class="sbutton previous">&Leftarrow;</button>' +
            '           <button type="button" class="sbutton link"><img class="" src="' + this.options.buttons.link.icon + '" title="Edit link"></button>' +
            '           <button type="button" class="sbutton image"><img class="" src="' + this.options.buttons.image.icon + '" title="Edit image"></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton confirm">&check; Ok</button>' +
            '       </div>' +
            '   </div>' +
            '</dialog>';

        this.container.insertAdjacentHTML('beforeend', dialogCode);

        return document.getElementById('ncsedt-dialog-code');
    };

    /**
     * Edit source code dialog events
     */
    ncSimpleHtmlEditor.prototype.setEventsDialogCode = function () {
        var _this = this;

        document.querySelector("#ncsedt-dialog-code .cancel").addEventListener('click', function () {
            _this.dialogCode.close();
        });

        document.querySelector("#ncsedt-dialog-code .parent").addEventListener('click', function () {
            _this.editCodeParent();
        });

        document.querySelector("#ncsedt-dialog-code .child").addEventListener('click', function () {
            _this.editCodeChild();
        });

        // document.querySelector("#ncsedt-dialog-code .previous").addEventListener('click', function() {
        //     _this.editCodePrev();
        // });

        document.querySelector("#ncsedt-dialog-code .confirm").addEventListener('click', function () {
            _this.editCodeConfirm();
        });

        document.querySelector("#ncsedt-dialog-code .link").addEventListener('click', function () {
            if (_this.dialogCode.open) {
                _this.dialogCode.close();
            }

            _this.command(_this.options.buttons.link)
        });

        document.querySelector("#ncsedt-dialog-code .image").addEventListener('click', function () {
            if (_this.dialogCode.open) {
                _this.dialogCode.close();
            }

            _this.setFocus(_this.focused.querySelector('img'));
            _this.command(_this.options.buttons.image)
        });
    };

    /**
     * Edit source code dialog commands
     */

    ncSimpleHtmlEditor.prototype.editCode = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.querySelector('img') || this.focused.parentElement.querySelector('img')) {
            this.dialogCode.querySelector('#ncsedt-dialog-code .image').style.visibility = "visible";
        } else {
            this.dialogCode.querySelector('#ncsedt-dialog-code .image').style.visibility = "hidden";
        }

        if (window.getSelection().toString() || this.focused.querySelector('a') || this.focused.parentElement.querySelector('a')) {
            this.dialogCode.querySelector('#ncsedt-dialog-code .link').style.visibility = "visible";
        } else {
            this.dialogCode.querySelector('#ncsedt-dialog-code .link').style.visibility = "hidden";
        }

        this.dialogCode.querySelector('textarea.code').value = this.focused.innerHTML;

        if (!this.dialogCode.open) {
            this.dialogCode.showModal();
        }
    };

    ncSimpleHtmlEditor.prototype.editCodeConfirm = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.dialogCode.open) {
            this.dialogCode.close();
        }

        if (this.focused.isContentEditable) {
            if (this.focused.innerHTML != this.dialogCode.querySelector('textarea.code').value) {
                this.focused.innerHTML = this.dialogCode.querySelector('textarea.code').value;
            }
        }
    };

    ncSimpleHtmlEditor.prototype.editCodeParent = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.parentElement && this.focused.parentElement.isContentEditable) {
            this.setFocus(this.focused.parentElement);
            this.editCode();
        }
    };

    ncSimpleHtmlEditor.prototype.editCodePrev = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focusedPrev && this.focusedPrev.isContentEditable) {
            this.setFocus(this.focusedPrev);
            this.editCode();
        }
    };

    ncSimpleHtmlEditor.prototype.editCodeChild = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.firstElementChild && this.focused.firstElementChild.isContentEditable) {
            this.setFocus(this.focused.firstElementChild);
            this.editCode();
        }
    };

    /* ----------------------------------------------------------- */

    /**
     * Edit image dialog
     */
    ncSimpleHtmlEditor.prototype.renderDialogImage = function () {
        var _this = this;
        var dialogImage =
            '<dialog id="ncsedt-dialog-image" class="ncsedt-dialog">' +
            '    <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton dragger"><img class="" src="' + this.options.draggerIcon + '" title="Move"> <span id="ncsedt-dialog-image-title">Edit image</span></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton cancel"> <b>&Cross;</b> </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="body">' +
            '       <div class="preview">' +
            '           <img class="image" src="' + this.options.buttons.image.icon + '">' +
            '           <button id="ncsedt-dialog-image-upload" type="button" class="upload sbutton">&UpArrowBar; Upload</button>' +
            '           <input id="ncsedt-dialog-image-file" class="file" accept="image/*" type="file" />' +
            '       </div>' +
            '       <label for="ncsedt-dialog-image-src">Image URL:</label>' +
            '       <input id="ncsedt-dialog-image-src" class="src sbutton" type="text">' +
            '       <div class="separator"></div>' +
            '       <label for="ncsedt-dialog-image-alt">Alt. text:</label>' +
            '       <input id="ncsedt-dialog-image-alt" class="alt sbutton" type="text">' +
            '       <div class="separator"></div>' +
            '       <input size="3" id="ncsedt-dialog-image-width" class="width sbutton" type="text" placeholder="auto">' +
            '       <button type="button" class="sbutton style-width" value="100%">&longleftrightarrow;</button>' +
            '       <button type="button" class="sbutton style-width" value="50%">50%</button>' +
            '       <button type="button" class="sbutton style-width" value="25%">25%</button>' +
            '       <button type="button" class="sbutton style-width" value="">&circlearrowleft;</button>' +
            '       <div class="separator"></div>' +
            '       <input size="3" id="ncsedt-dialog-image-height" class="height sbutton style-height" type="text" placeholder="auto">' +
            '       <button type="button" class="sbutton style-height" value="100%">&UpDownArrow;</button>' +
            '       <button type="button" class="sbutton style-height" value="">&circlearrowleft;</button>' +
            '       <div class="separator"></div>' +
            '       <input size="3" id="ncsedt-dialog-image-float" class="float sbutton style-float" type="text" placeholder="no">' +
            '       <button type="button" class="sbutton style-float" value="left">&looparrowleft;</button>' +
            '       <button type="button" class="sbutton style-float" value="right">&looparrowright;</button>' +
            '       <button type="button" class="sbutton style-float" value="">&circlearrowleft;</button>' +
            '       <div class="separator"></div>' +
            '       <input size="3" id="ncsedt-dialog-image-padding" class="padding sbutton style-padding" type="text" placeholder="no">' +
            '       <button type="button" class="sbutton style-padding" value="10px">&sdotb;</button>' +
            '       <button type="button" class="sbutton style-padding" value="">&circlearrowleft;</button>' +
            '       <div class="image-remove">' +
            '           <div class="separator"></div>' +
            '           <label for="ncsedt-dialog-image-remove">Remove image:</label>' +
            '           <input id="ncsedt-dialog-image-remove" class="remove" type="checkbox">' +
            '       </div>' +
            '   </div>' +
            '   <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton parent">&Uparrow;</button>' +
            '           <button type="button" class="sbutton child">&Downarrow;</button>' +
            // '           <button type="button" class="sbutton previous">&Leftarrow;</button>' +
            '           <button type="button" class="sbutton code"><img class="" src="' + this.options.buttons.code.icon + '" title="Edit code"></button>' +
            '           <button type="button" class="sbutton link"><img class="" src="' + this.options.buttons.link.icon + '" title="Edit link"></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton confirm">&check; Ok</button>' +
            '       </div>' +
            '   </div>' +
            '</dialog>';

        this.container.insertAdjacentHTML('beforeend', dialogImage);

        return document.getElementById('ncsedt-dialog-image');
    };

    /**
     * Edit image dialog events
     */

    ncSimpleHtmlEditor.prototype.setEventsDialogImage = function () {
        var _this = this;

        document.querySelector("#ncsedt-dialog-image .cancel").addEventListener('click', function () {
            _this.dialogImage.close();
        });

        document.querySelector("#ncsedt-dialog-image .confirm").addEventListener('click', function () {
            _this.editImageConfirm();
        });

        document.querySelector("#ncsedt-dialog-image .parent").addEventListener('click', function () {
            _this.editImageParent();
        });

        document.querySelector("#ncsedt-dialog-image .child").addEventListener('click', function () {
            _this.editImageChild();
        });

        // document.querySelector("#ncsedt-dialog-image .previous").addEventListener('click', function() {
        //     _this.editImagePrev();
        // });

        document.querySelector("#ncsedt-dialog-image .code").addEventListener('click', function () {
            if (_this.dialogImage.open) {
                _this.dialogImage.close();
            }

            _this.command(_this.options.buttons.code)
        });

        document.querySelector("#ncsedt-dialog-image .link").addEventListener('click', function () {
            if (_this.dialogImage.open) {
                _this.dialogImage.close();
            }

            _this.command(_this.options.buttons.link)
        });

        document.querySelector("#ncsedt-dialog-image .upload").addEventListener('click', function () {
            document.querySelector("#ncsedt-dialog-image-file").dispatchEvent(new MouseEvent("click"));
        });

        document.querySelector("#ncsedt-dialog-image-file").addEventListener('change', function (e) {
            if (this.files[0].size > 1100000) {
                alert("File is too big! 1Mb. max. (Use .webp format)");
                this.value = "";

                return false;
            };

            var reader = new window.FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onloadend = function () {
                _this.dialogImage.querySelector('#ncsedt-dialog-image .image').src = reader.result;
                _this.dialogImage.querySelector('#ncsedt-dialog-image .src').value = 'data:image/...';
            }
        });

        document.querySelectorAll("#ncsedt-dialog-image button.style-width").forEach(function (element) {
            element.addEventListener('click', function (evt) {
                _this.dialogImage.querySelector('#ncsedt-dialog-image-width').value = evt.target.value;
            });
        });

        document.querySelectorAll("#ncsedt-dialog-image button.style-height").forEach(function (element) {
            element.addEventListener('click', function (evt) {
                _this.dialogImage.querySelector('#ncsedt-dialog-image-height').value = evt.target.value;
            });
        });

        document.querySelectorAll("#ncsedt-dialog-image button.style-float").forEach(function (element) {
            element.addEventListener('click', function (evt) {
                _this.dialogImage.querySelector('#ncsedt-dialog-image-float').value = evt.target.value;
                if (evt.target.value) {
                    _this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value = '10px';
                } else {
                    _this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value = '';
                }
            });
        });

        document.querySelectorAll("#ncsedt-dialog-image button.style-padding").forEach(function (element) {
            element.addEventListener('click', function (evt) {
                _this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value = evt.target.value;
            });
        });
    };

    /**
     * Edit image dialog commands
     */

    ncSimpleHtmlEditor.prototype.editImage = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.parentElement.tagName == 'IMG') {
            this.editImageParent();
        }

        if (this.focused.firstElementChild && this.focused.lastElementChild) {
            if (this.focused.firstElementChild.tagName == 'IMG' && this.focused.lastElementChild.tagName == 'IMG') {
                this.editImageChild();
            }
        }

        this.currentSelection = window.getSelection();
        this.currentRange = this.currentSelection.getRangeAt(0);
        this.dialogImage.querySelector('#ncsedt-dialog-image-remove').checked = false;

        if (this.focused.tagName == 'IMG') {

            /*
                Edit existing
            */
            var style = window.getComputedStyle(this.focused);

            this.dialogImage.querySelector('#ncsedt-dialog-image-title').innerHTML = 'Image (Edit)';
            this.dialogImage.querySelector('.preview img').src = this.focused.src;

            if (this.focused.getAttribute('src').startsWith("data:image/")) {
                this.dialogImage.querySelector('#ncsedt-dialog-image-src').value = 'data:image/...'
            } else {
                this.dialogImage.querySelector('#ncsedt-dialog-image-src').value = this.focused.getAttribute('src');
            }

            this.dialogImage.querySelector('#ncsedt-dialog-image-alt').value = this.focused.getAttribute('alt');
            this.dialogImage.querySelector('#ncsedt-dialog-image-width').value = this.focused.style.width;
            this.dialogImage.querySelector('#ncsedt-dialog-image-height').value = this.focused.style.height;
            this.dialogImage.querySelector('#ncsedt-dialog-image-float').value = this.focused.style.float;
            this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value = this.focused.style.padding;
            this.dialogImage.querySelector('#ncsedt-dialog-image .image-remove').style.visibility = "visible";
        } else {

            /*
                Edit new
            */
            this.dialogImage.querySelector('#ncsedt-dialog-image-title').innerHTML = 'Image (CREATE)';
            this.dialogImage.querySelector('.preview img').src = this.options.buttons.image.icon;
            this.dialogImage.querySelector('#ncsedt-dialog-image-src').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image-alt').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image-width').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image-height').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image-float').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value = '';
            this.dialogImage.querySelector('#ncsedt-dialog-image .image-remove').style.visibility = "hidden";
        }

        if (!this.dialogImage.open) {
            this.dialogImage.showModal();
        }
    };

    ncSimpleHtmlEditor.prototype.editImageConfirm = function () {
        if (this.dialogImage.open) {
            this.dialogImage.close();
        }

        if (!this.editEnable) {
            return;
        }

        if (!this.focused.isContentEditable) {
            return;
        }

        if (this.focused.tagName == 'IMG') {
            if (this.dialogImage.querySelector('#ncsedt-dialog-image-remove').checked) {
                this.focused.outerHTML = this.focused.innerHTML;
            } else {
                this.editImageConfirmExisting();
            }
        } else {
            this.editImageConfirmNew();
        }
    };

    ncSimpleHtmlEditor.prototype.editImageConfirmExisting = function () {
        var newsrc = this.dialogImage.querySelector('#ncsedt-dialog-image-src').value;
        var newalt = this.dialogImage.querySelector('#ncsedt-dialog-image-alt').value;
        var newwidth = this.dialogImage.querySelector('#ncsedt-dialog-image-width').value;
        var newheight = this.dialogImage.querySelector('#ncsedt-dialog-image-height').value;
        var newfloat = this.dialogImage.querySelector('#ncsedt-dialog-image-float').value;
        var newpadding = this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value;
        var oldsrc = this.focused.getAttribute('src');
        var oldalt = this.focused.getAttribute('alt');
        var oldwidth = this.focused.style.width;
        var oldheight = this.focused.style.height;
        var oldfloat = this.focused.style.float;
        var oldpadding = this.focused.style.padding;

        if (newwidth && !isNaN(newwidth)) {
            newwidth += '%';
        }

        if (newheight && !isNaN(newheight)) {
            newheight += '%';
        }

        if (newpadding && !isNaN(newpadding)) {
            newpadding += 'px';
        }

        if (oldsrc != newsrc) {
            if (newsrc == 'data:image/...') {
                newsrc = this.dialogImage.querySelector('#ncsedt-dialog-image .image').src;
            }

            this.historyForcePush('src', newsrc);
            this.focused.setAttribute('src', newsrc);
        }

        if (oldalt != newalt) {
            this.historyForcePush('alt', newalt);
            this.focused.setAttribute('alt', newalt);
        }

        if (oldwidth != newwidth) {
            this.focused.style.width = newwidth;
            this.historyForcePush('style', this.focused.style.cssText);
        }

        if (oldheight != newheight) {
            this.focused.style.height = newheight;
            this.historyForcePush('style', this.focused.style.cssText);
        }

        if (oldfloat != newfloat) {
            this.focused.style.float = newfloat;
            this.historyForcePush('style', this.focused.style.cssText);
        }

        if (oldpadding != newpadding) {
            this.focused.style.padding = newpadding;
            this.historyForcePush('style', this.focused.style.cssText);
        }
    };

    ncSimpleHtmlEditor.prototype.editImageConfirmNew = function () {
        var newsrc = this.dialogImage.querySelector('#ncsedt-dialog-image-src').value;
        var newalt = this.dialogImage.querySelector('#ncsedt-dialog-image-alt').value;
        var newwidth = this.dialogImage.querySelector('#ncsedt-dialog-image-width').value;
        var newheight = this.dialogImage.querySelector('#ncsedt-dialog-image-height').value;
        var newfloat = this.dialogImage.querySelector('#ncsedt-dialog-image-float').value;
        var newpadding = this.dialogImage.querySelector('#ncsedt-dialog-image-padding').value;

        if (!isNaN(newwidth)) {
            newwidth += '%';
        }

        if (!isNaN(newheight)) {
            newheight += '%';
        }

        if (newsrc) {
            if (newsrc == 'data:image/...') {
                newsrc = this.dialogImage.querySelector('#ncsedt-dialog-image .image').src;
            }

            var newimg = document.createElement('img');
            newimg.setAttribute('src', newsrc);
            newimg.setAttribute('alt', newalt);
            newimg.style.width = newwidth;
            newimg.style.height = newheight;
            newimg.style.float = newfloat;
            newimg.style.padding = newpadding;
            this.currentRange.surroundContents(newimg);
        }
    };

    ncSimpleHtmlEditor.prototype.editImageParent = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.parentElement && this.focused.parentElement.tagName == 'IMG' && this.focused.parentElement.isContentEditable) {
            this.setFocus(this.focused.parentElement);
            this.editImage();
        } else if (this.focused.parentElement.parentElement && this.focused.parentElement.parentElement.querySelector('img') && this.focused.parentElement.parentElement.isContentEditable) {
            this.setFocus(this.focused.parentElement.parentElement.querySelector('img'));
            this.editImage();
        } else if (this.focused.previousElementSibling && this.focused.previousElementSibling.tagName == 'IMG' && this.focused.previousElementSibling.isContentEditable) {
            this.setFocus(this.focused.previousElementSibling);
            this.editImage();
        }

    };

    ncSimpleHtmlEditor.prototype.editImagePrev = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focusedPrev && this.focusedPrev.isContentEditable) {
            this.setFocus(this.focusedPrev);
            this.editImage();
        }
    };

    ncSimpleHtmlEditor.prototype.editImageChild = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.querySelector('img')) {
            this.setFocus(this.focused.querySelector('img'));
            this.editImage();
        } else if (this.focused.nextElementSibling && this.focused.nextElementSibling.tagName == 'IMG' && this.focused.nextElementSibling.isContentEditable) {
            this.setFocus(this.focused.nextElementSibling);
            this.editImage();
        }

        // disable button if no match
    };

    /* ----------------------------------------------------------- */

    /**
     * Edit link dialog
     */
    ncSimpleHtmlEditor.prototype.renderDialogLink = function () {
        var dialogLink =
            '<dialog id="ncsedt-dialog-link" class="ncsedt-dialog">' +
            '    <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton dragger"><img class="" src="' + this.options.draggerIcon + '" title="Move"> <span id="ncsedt-dialog-link-title">Edit link</span></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton cancel"> <b>&Cross;</b> </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="body">' +
            '       <label for="ncsedt-dialog-link-anchor">Anchor:</label>' +
            '       <textarea id="ncsedt-dialog-link-anchor" rows="2" class="anchor sbutton" placeholder=" ( empty ) "></textarea>' +
            '       <label for="ncsedt-dialog-link-href">URL:</label>' +
            '       <input id="ncsedt-dialog-link-href" class="href sbutton" type="text">' +
            '       <label for="ncsedt-dialog-link-target">Open in new:</label>' +
            '       <input id="ncsedt-dialog-link-target" class="target" type="checkbox">' +
            '       <div class="link-remove" style="float: right">' +
            '           <label for="ncsedt-dialog-link-remove">Remove link:</label>' +
            '           <input id="ncsedt-dialog-link-remove" class="remove" type="checkbox">' +
            '       </div>' +
            '   </div>' +
            '   <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton parent">&Uparrow;</button>' +
            '           <button type="button" class="sbutton child">&Downarrow;</button>' +
            // '           <button type="button" class="sbutton previous">&Leftarrow;</button>' +
            '           <button type="button" class="sbutton code"><img class="" src="' + this.options.buttons.code.icon + '" title="Edit code"></button>' +
            '           <button type="button" class="sbutton image"><img class="" src="' + this.options.buttons.image.icon + '" title="Edit image"></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton confirm">&check; Ok</button>' +
            '       </div>' +
            '   </div>' +
            '</dialog>';

        this.container.insertAdjacentHTML('beforeend', dialogLink);

        return document.getElementById('ncsedt-dialog-link');
    };

    /**
     * Edit link dialog events
     */

    ncSimpleHtmlEditor.prototype.setEventsDialogLink = function () {
        var _this = this;

        document.querySelector("#ncsedt-dialog-link .cancel").addEventListener('click', function () {
            _this.dialogLink.close();
        });

        document.querySelector("#ncsedt-dialog-link .parent").addEventListener('click', function () {
            _this.editLinkParent();
        });

        document.querySelector("#ncsedt-dialog-link .child").addEventListener('click', function () {
            _this.editLinkChild();
        });

        // document.querySelector("#ncsedt-dialog-link .previous").addEventListener('click', function() {
        //     _this.editLinkPrev();
        // });

        document.querySelector("#ncsedt-dialog-link .confirm").addEventListener('click', function () {
            _this.editLinkConfirm();
        });

        document.querySelector("#ncsedt-dialog-link .code").addEventListener('click', function () {
            if (_this.dialogLink.open) {
                _this.dialogLink.close();
            }

            _this.command(_this.options.buttons.code)
        });

        document.querySelector("#ncsedt-dialog-link .image").addEventListener('click', function () {
            if (_this.dialogLink.open) {
                _this.dialogLink.close();
            }

            _this.command(_this.options.buttons.image)
        });
    };

    /**
     * Edit link dialog commands
     */

    ncSimpleHtmlEditor.prototype.editLink = function () {
        if (!this.editEnable) {
            return;
        }

        this.currentSelection = window.getSelection();
        this.currentRange = this.currentSelection.getRangeAt(0);

        if (this.focused.parentElement.tagName == 'A') {
            this.editLinkParent();
        }

        if (this.focused.firstElementChild && this.focused.lastElementChild) {
            if (this.focused.firstElementChild.tagName == 'A' && this.focused.lastElementChild.tagName == 'A' && !this.currentSelection.toString()) {
                this.editLinkChild();
            }
        }

        if (this.focused.tagName == 'IMG' || (this.focused.firstElementChild && this.focused.firstElementChild.tagName == 'IMG')) {
            this.dialogLink.querySelector('#ncsedt-dialog-link .image').style.visibility = "visible";
        } else {
            this.dialogLink.querySelector('#ncsedt-dialog-link .image').style.visibility = "hidden";
        }

        if (this.focused.tagName == 'A') {

            /*
                Edit existing
            */
            this.dialogLink.querySelector('#ncsedt-dialog-link-title').innerHTML = 'Link (Edit)';
            this.dialogLink.querySelector('#ncsedt-dialog-link-anchor').value = this.focused.innerHTML;
            this.dialogLink.querySelector('#ncsedt-dialog-link-href').value = this.focused.getAttribute("href");
            this.dialogLink.querySelector('#ncsedt-dialog-link-remove').checked = false;
            this.dialogLink.querySelector('#ncsedt-dialog-link .link-remove').style.visibility = "visible";

            if (this.focused.getAttribute('target') == '_blank') {
                this.dialogLink.querySelector('#ncsedt-dialog-link-target').checked = true;
            } else {
                this.dialogLink.querySelector('#ncsedt-dialog-link-target').checked = false;
            }
        } else {

            /*
                Edit new
            */
            if (this.currentSelection.anchorNode.nodeType == Node.TEXT_NODE && this.currentSelection.toString()) {
                var anchor = this.currentSelection;
            } else {
                var anchor = this.focused.innerHTML || this.focused.outerHTML;
            }

            this.dialogLink.querySelector('#ncsedt-dialog-link-title').innerHTML = 'Link (CREATE)';
            this.dialogLink.querySelector('.anchor').value = anchor;
            this.dialogLink.querySelector('.href').value = '';
            this.dialogLink.querySelector('#ncsedt-dialog-link-target').checked = false;
            this.dialogLink.querySelector('#ncsedt-dialog-link-remove').checked = false;
            this.dialogLink.querySelector('#ncsedt-dialog-link .link-remove').style.visibility = "hidden";
        }

        if (!this.dialogLink.open) {
            this.dialogLink.showModal();
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkConfirm = function () {
        if (this.dialogLink.open) {
            this.dialogLink.close();
        }

        if (!this.editEnable) {
            return;
        }

        if (!this.focused.isContentEditable) {
            return;
        }

        if (this.focused.tagName == 'A') {
            if (this.dialogLink.querySelector('#ncsedt-dialog-link-remove').checked) {
                this.focused.outerHTML = this.focused.innerHTML;
            } else {
                this.editLinkConfirmExisting();
            }
        } else {
            this.editLinkConfirmNew();
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkConfirmExisting = function () {
        var newtarget = this.dialogLink.querySelector('#ncsedt-dialog-link-target').checked ? '_blank' : "";
        var newanchor = this.dialogLink.querySelector('#ncsedt-dialog-link-anchor').value;
        var newurl = this.dialogLink.querySelector('#ncsedt-dialog-link-href').value;

        var oldtarget = this.focused.getAttribute('target');
        var oldanchor = this.focused.innerHTML;
        var oldurl = this.focused.getAttribute('href');

        if (oldtarget != newtarget || oldanchor != newanchor || oldurl != newurl) {
            this.historyForcePush('href', newurl);
            this.historyForcePush('target', newtarget);
            this.focused.innerHTML = newanchor;
            this.focused.setAttribute('href', newurl);
            this.focused.setAttribute('target', newtarget);
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkConfirmNew = function () {
        var newtarget = this.dialogLink.querySelector('#ncsedt-dialog-link-target').checked ? '_blank' : "";
        var newanchor = this.dialogLink.querySelector('#ncsedt-dialog-link-anchor').value;
        var newurl = this.dialogLink.querySelector('#ncsedt-dialog-link-href').value;

        if (newanchor.length || newurl.length) {
            var newlink = document.createElement('a');
            newlink.setAttribute('href', newurl);
            newlink.setAttribute('target', newtarget);

            if (this.focused.contains(this.currentRange.commonAncestorContainer)) {
                this.currentRange.surroundContents(newlink);
                newlink.innerHTML = newanchor;
            } else {
                newlink.innerHTML = newanchor
                this.focused.outerHTML = newlink.outerHTML;
            }
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkParent = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.parentElement && this.focused.parentElement.isContentEditable) {
            this.setFocus(this.focused.parentElement);
            this.editLink();
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkPrev = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focusedPrev && this.focusedPrev.isContentEditable) {
            this.setFocus(this.focusedPrev);
            this.editLink();
        }
    };

    ncSimpleHtmlEditor.prototype.editLinkChild = function () {
        if (!this.editEnable) {
            return;
        }

        if (this.focused.firstElementChild && this.focused.firstElementChild.isContentEditable) {
            this.setFocus(this.focused.firstElementChild);
            this.editLink();
        }
    };

    /* ----------------------------------------------------------- */

    /**
     * Edit head dialog
     */
    ncSimpleHtmlEditor.prototype.renderDialogHead = function () {
        var dialogHead =
            '<dialog id="ncsedt-dialog-head" class="ncsedt-dialog">' +
            '    <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton dragger"><img class="" src="' + this.options.draggerIcon + '" title="Move"> <span id="ncsedt-dialog-title">Edit head</span></button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton cancel"> <b>&Cross;</b> </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="body">' +
            '       <label for="ncsedt-dialog-head-title">Title:</label>' +
            '       <input id="ncsedt-dialog-head-title" class="title sbutton" type="text">' +
            '       <div class="separator"></div>' +
            '       <label for="ncsedt-dialog-head-description">Description:</label>' +
            '       <textarea id="ncsedt-dialog-head-description" rows="3" class="description sbutton" placeholder=" ( empty ) "></textarea>' +
            '       <div class="separator"></div>' +
            '       <div class="edit-all" style="display: none">' +
            '           <label for="ncsedt-dialog-head-all">Edit source code:</label>' +
            '           <textarea id="ncsedt-dialog-head-all" rows="3" class="all sbutton" placeholder=" ( empty ) "></textarea>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ncsedt-btns">' +
            '       <div class="ncsedt-btns-left">' +
            '           <button type="button" class="sbutton show-all"><img class="" src="' + this.options.buttons.code.icon + '" title="Edit code"> Edit all</button>' +
            '       </div>' +
            '       <div class="ncsedt-btns-right">' +
            '           <button type="button" class="sbutton confirm">&check; Ok</button>' +
            '       </div>' +
            '   </div>' +
            '</dialog>';

        this.container.insertAdjacentHTML('beforeend', dialogHead);

        return document.getElementById('ncsedt-dialog-head');
    };

    /**
     * Edit head dialog events
     */

    ncSimpleHtmlEditor.prototype.setEventsDialogHead = function () {
        var _this = this;

        document.querySelector("#ncsedt-dialog-head .cancel").addEventListener('click', function () {
            _this.dialogHead.close();
        });

        document.querySelector("#ncsedt-dialog-head .show-all").addEventListener('click', function () {
            if (_this.dialogHead.querySelector('#ncsedt-dialog-head .edit-all').style.display == "none") {
                _this.dialogHead.querySelector('#ncsedt-dialog-head .edit-all').style.display = 'inline-block';
            } else {
                _this.dialogHead.querySelector('#ncsedt-dialog-head .edit-all').style.display = 'none';
            }
        });

        document.querySelector("#ncsedt-dialog-head .confirm").addEventListener('click', function () {
            _this.editHeadConfirm();
        });
    };

    /**
     * Edit head dialog commands
     */

    ncSimpleHtmlEditor.prototype.editHead = function () {
        if (!this.editEnable) {
            return;
        }

        if (document.head.querySelector('meta[name="description"]')) {
            var description = document.head.querySelector('meta[name="description"]').getAttribute("content");
        } else {
            var description = '';
        }

        this.dialogHead.querySelector('#ncsedt-dialog-head-title').value = document.title || 'pedo';
        this.dialogHead.querySelector('#ncsedt-dialog-head-description').value = description;
        this.dialogHead.querySelector('#ncsedt-dialog-head-all').value = document.head.innerHTML;

        if (!this.dialogHead.open) {
            this.dialogHead.showModal();
        }
    };

    ncSimpleHtmlEditor.prototype.editHeadConfirm = function () {
        if (this.dialogHead.open) {
            this.dialogHead.close();
        }

        if (!this.editEnable) {
            return;
        }

        if (document.head.querySelector('meta[name="description"]')) {
            var description = document.head.querySelector('meta[name="description"]').getAttribute("content");
        } else {
            var description = '';
        }

        var newtitle = this.dialogHead.querySelector('#ncsedt-dialog-head-title').value;
        var newdescription = this.dialogHead.querySelector('#ncsedt-dialog-head-description').value;
        var newhead = this.dialogHead.querySelector('#ncsedt-dialog-head-all').value
        var oldtitle = document.title;
        var oldescription = description;
        var oldhead = document.head.innerHTML;

        if (newhead != oldhead) {
            document.head.innerHTML = newhead;
        }

        if (newtitle != oldtitle) {
            document.title = newtitle;
        }

        if (newdescription != oldescription) {
            if (!document.head.querySelector('meta[name="description"]')) {
                var meta = document.createElement('meta');
                meta.setAttribute("name", "description");
                document.head.appendChild(meta);
            }

            this.historyForcePush('content', newdescription);
            document.head.querySelector('meta[name="description"]').setAttribute("content", newdescription);
        }
    };

    /* ----------------------------------------------------------- */

})();

(function () {
    window.ncSimpleMoveable = function (movableSelector, draggerSelector) {
        this.movable = document.querySelector(movableSelector);
        this.dragger = document.querySelector(draggerSelector);
        var supports = document.createElement('div');

        if ('ontouchstart' in supports) {
            this.movableOnTouch();
        } else {
            this.movableOnDrag();
        }
    }

    ncSimpleMoveable.prototype.movableOnDrag = function () {
        var _this = this;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        this.movable.style.position = 'fixed';
        this.dragger.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            var style = window.getComputedStyle(_this.movable);
            var marginTop = parseInt(style.getPropertyValue('margin-top'));
            var marginLeft = parseInt(style.getPropertyValue('margin-left'));
            _this.movable.style.margin = '0px';
            _this.movable.style.top = (_this.movable.offsetTop + marginTop) + "px";
            _this.movable.style.left = (_this.movable.offsetLeft + marginLeft) + "px";
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            _this.movable.style.top = (_this.movable.offsetTop - pos2) + "px";
            _this.movable.style.left = (_this.movable.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            var xDraggerOffset = _this.dragger.offsetLeft;
            var xOffset = _this.movable.offsetLeft + xDraggerOffset;
            var yDraggerOffset = _this.dragger.offsetTop;
            var yOffset = _this.movable.offsetTop + yDraggerOffset;
            var xMax = window.innerWidth - _this.dragger.offsetWidth;
            var yMax = window.innerHeight - _this.dragger.offsetHeight;
            var xMIn = 0;
            var yMin = 0;

            if (yOffset > yMax) {
                _this.movable.style.top = (yMax - yDraggerOffset) + 'px';
            }

            if (yOffset < yMin) {
                _this.movable.style.top = (yMin - yDraggerOffset) + 'px';
            }

            if (xOffset > xMax) {
                _this.movable.style.left = (xMax - xDraggerOffset) + 'px';
            }

            if (xOffset < xMIn) {
                _this.movable.style.left = (xMIn - xDraggerOffset) + 'px';
            }
        }
    };

    ncSimpleMoveable.prototype.movableOnTouch = function () {
        var _this = this;
        this.movable.style.position = 'fixed';

        this.dragger.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var xOffset = _this.dragger.offsetLeft + Math.round(_this.dragger.offsetWidth / 2);
            var yOffset = _this.dragger.offsetTop + Math.round(_this.dragger.offsetHeight / 2);
            _this.movable.style.margin = '0px';
            var touchLocation = e.targetTouches[0];
            _this.movable.style.left = touchLocation.pageX - xOffset + 'px';
            _this.movable.style.top = touchLocation.pageY - window.pageYOffset - yOffset + 'px';
        });

        this.movable.addEventListener('touchend', function (e) {
            var xDraggerOffset = _this.dragger.offsetLeft;
            var xOffset = _this.movable.offsetLeft + xDraggerOffset;
            var yDraggerOffset = _this.dragger.offsetTop;
            var yOffset = _this.movable.offsetTop + yDraggerOffset;
            var xMax = window.innerWidth - _this.dragger.offsetWidth;
            var yMax = window.innerHeight - _this.dragger.offsetHeight;
            var xMIn = 0;
            var yMin = 0;

            if (yOffset > yMax) {
                _this.movable.style.top = (yMax - yDraggerOffset) + 'px';
            }

            if (yOffset < yMin) {
                _this.movable.style.top = (yMin - yDraggerOffset) + 'px';
            }

            if (xOffset > xMax) {
                _this.movable.style.left = (xMax - xDraggerOffset) + 'px';
            }

            if (xOffset < xMIn) {
                _this.movable.style.left = (xMIn - xDraggerOffset) + 'px';
            }
        });
    };
})();

(function () {
    if (document.currentScript.dataset.ncsheditorauto) {
        window.addEventListener('DOMContentLoaded', function () {
            if (!("ncSHEditor" in window)) {
                ncSHEditor = new ncSimpleHtmlEditor();
                ncSHEditor.start();
            }
        });
    }
})();

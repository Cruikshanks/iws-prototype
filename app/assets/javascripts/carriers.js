var carriersTableId = "#carriersTable";

$(document).ready(function () {
    carriersListSelect2Init();

    // $(carriersTableId + "> tbody").sortable({
    //     axis: "y",
    //     update: function () {
    //         updateCarrierOrder();
    //     }
    // });
    // $(carriersTableId).disableSelection();
});

function carriersListSelect2Init() {
    $("select[data-select-box='true']").removeClass("form-control").select2({
        placeholder: "Please select...",
        sortResults: function (results, container, query) {
            return results.sort(function (a, b) {
                a = a.text.toLowerCase();
                b = b.text.toLowerCase();

                var ax = [], bx = [];

                a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

                while (ax.length && bx.length) {
                    var an = ax.shift();
                    var bn = bx.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if (nn) return nn;
                }

                return ax.length - bx.length;
            });
        }
    }).each(function () {
        var selectBox = $(this);
        $("a[href='#" + selectBox.attr("id") + "']").click(function () {
            selectBox.select2("focus");
        });

        selectBox.next(":button").click(function () {
            var data = selectBox.select2('data');

            $(carriersTableId).each(function () {
                var tbody = $('tbody', this).length > 0 ? $('tbody', this) : $(this);
                var firstRow = $('tbody', this).length > 0 ? $('tbody tr:first', this) : $('tr:first', this);

                if (firstRow.length === 1 && firstRow[0].childElementCount === 1) {
                    firstRow.remove();
                }

                var tds = '<tr>';
                tds += '<td>' + getOrdinal(tbody[0].childElementCount + 1) + '</td>';
                tds += '<td>' + data.text + '</td>';
                tds += '<td><button class="link-submit" type="submit" name="remove">Remove</button></td>'
                tds += '</tr>';

                tbody.append(tds);
                updateCarrierOrder();
            }).on("click", ":button", function (e) {
                $(this).closest("tr").remove();
                updateCarrierOrder();
            });
        });
    })

    $("select[data-select-allow-clear='true']").select2({
        allowClear: true
    });
}

function updateCarrierOrder() {
    $(carriersTableId + " > tbody > tr").each(function (rowIndex, tr) {
        var orderLabel = getOrdinal(rowIndex + 1);
        var rowCount = tr.parentNode.childElementCount;
        if (rowCount > 2 && rowCount === rowIndex + 1)
        {
            orderLabel = "Last";
        }
        tr.firstChild.innerHTML = orderLabel;
    });
}

function getOrdinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
window.addEventListener('load', function () {
    getDataAndAppend("firstname");
    $("#totalusers").css("background-color", "lightgray");
})

let documents = {};

async function getMarker() {
    const snapshot = await db.collection('usersdata').get()
    snapshot.forEach(doc => {
        documents[doc.id] = doc.data();
    });
    return documents;
}

async function getDataAndAppend(userNotReq) {

    await getMarker();

    let dataSet = [
        []
    ];

    for (let i = 0; i <= Object.keys(documents).length - 1; i++) {
        if (userNotReq == "adminVerification") {
            if (!documents[Object.keys(documents)[i]][userNotReq])
                dataSet[i] = [documents[Object.keys(documents)[i]]["firstname"], documents[Object.keys(documents)[i]]["dateSubmitted"], documents[Object.keys(documents)[i]]["year"], documents[Object.keys(documents)[i]]["course"], documents[Object.keys(documents)[i]]["university"], documents[Object.keys(documents)[i]]["residentCity"], documents[Object.keys(documents)[i]]["referred"], Object.keys(documents)[i]]
        } else {
            if (documents[Object.keys(documents)[i]][userNotReq])
                dataSet[i] = [documents[Object.keys(documents)[i]]["firstname"], documents[Object.keys(documents)[i]]["dateSubmitted"], documents[Object.keys(documents)[i]]["year"], documents[Object.keys(documents)[i]]["course"], documents[Object.keys(documents)[i]]["university"], documents[Object.keys(documents)[i]]["residentCity"], documents[Object.keys(documents)[i]]["referred"], Object.keys(documents)[i]]
        }
    }

    for (let i = 0; i < dataSet.length; i++) {
        if (dataSet[i] == null) {
            dataSet.splice(i, 1);
        }
    }

    $(document).ready(function () {
        let table = $('#users-table').DataTable({
            data: dataSet,
            'bSort ': false,
            'aoColumns': [{
                    sWidth: "25%",
                    bSearchable: false,
                    bSortable: false
                },
                {
                    sWidth: "25%",
                    bSearchable: false,
                    bSortable: false
                },
                {
                    sWidth: "10%",
                    bSearchable: false,
                    bSortable: false
                }
            ],
            "scrollY": "200px",
            "scrollCollapse": true,
            "info": true,
            "destroy": true,
            "paging": true,
            responsive: true,
            "searching": true,
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [{
                    title: "Users"
                },
                {
                    title: "Date Applied"
                },
                {
                    title: 'Year'
                },
                {
                    title: 'Course'
                },
                {
                    title: "Institute"
                },
                {
                    title: "City"
                },
                {
                    title: 'Referred'
                },
            ]
        });

        $('#users-table tbody').on('click.DT', 'tr', function () {
            let data = table.row(this).data();
            document.location.href = '/admin/userinfo/' + data[7];
        });
    });
}

const totalUsers = document.getElementById('totalusers');
totalUsers.addEventListener('click', (e) => {
    e.preventDefault();
    getDataAndAppend("firstname");
    $("#totalusers").css("background-color", "lightgray");
    $("#newusers").css("background-color", "white");
    $("#sales").css("background-color", "white");
    $("#invent").css("background-color", "white");
})


const newUsers = document.getElementById('newusers');
newUsers.addEventListener('click', (e) => {
    e.preventDefault();
    getDataAndAppend("adminVerification");
    $("#totalusers").css("background-color", "white");
    $("#newusers").css("background-color", "lightgray");
    $("#sales").css("background-color", "white");
    $("#invent").css("background-color", "white");

})

const acceptedUsers = document.getElementById('sales');
acceptedUsers.addEventListener('click', (e) => {
    e.preventDefault();
    getDataAndAppend("accepted");
    $("#totalusers").css("background-color", "white");
    $("#newusers").css("background-color", "white");
    $("#sales").css("background-color", "lightgray");
    $("#invent").css("background-color", "white");

})

const rejectedUsers = document.getElementById('invent');
rejectedUsers.addEventListener('click', (e) => {
    e.preventDefault();
    getDataAndAppend("rejected");
    $("#totalusers").css("background-color", "white");
    $("#newusers").css("background-color", "white");
    $("#sales").css("background-color", "white");
    $("#invent").css("background-color", "lightgray");

})
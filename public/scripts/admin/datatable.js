window.addEventListener('load', () => {
    getDataAndAppend();
})

let documents = {};

const getMarker = async () => {
    const snapshot = await db.collection('usersdata').get()
    snapshot.forEach(doc => {
        documents[doc.id] = doc.data();
    });
    return documents;
}

const getDataAndAppend = async () => {

    await getMarker();

    let dataSet = [
        []
    ];

    for (let i = 0; i <= Object.keys(documents).length - 1; i++) {
        dataSet[i] = [documents[Object.keys(documents)[i]]["firstname"], documents[Object.keys(documents)[i]]["dateSubmitted"], documents[Object.keys(documents)[i]]["year"], documents[Object.keys(documents)[i]]["course"], documents[Object.keys(documents)[i]]["university"], documents[Object.keys(documents)[i]]["residentCity"], documents[Object.keys(documents)[i]]["referred"], Object.keys(documents)[i]]
    }

    $(document).ready(() => {
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
            "paging": true,
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

        $('#users-table tbody').on('click', 'tr', () => {
            let data = table.row(this).data();

            document.location.href = '/admin/userinfo/' + data[7];

        });
    });
}
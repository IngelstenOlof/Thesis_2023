//Add event listeners to all buttons for filtering functionality
const buttons = document.querySelectorAll("input");
buttons.forEach((button) => {
    button.addEventListener("click", filterJsonFile, "false");
});

//Fetch and filter JSON for graphing visualisation
async function fetchJsonFile() {
    const res = await fetch("../complete-solutions-02.json");
    const jsonData = await res.json();
    return jsonData;
}

function filterJsonFile(event) {
    fetchJsonFile().then((json) => {
        if (event.target.dataset.tag == "default") {
            Graph.graphData(json);
            return;
        }

        let result = {
            nodes: [],
            links: [],
        };

        for (let index in json.nodes) {
            if (
                json.nodes[index][event.target.dataset.tag] == event.target.value
            ) {
                result.nodes.push(json.nodes[index]);
            }
        }
        result.links = json.links;

        Graph.graphData(result);
    });
}

//Dynamically create drawer from fetched JSON data
function createDrawer(node) {
    //First check if one exists and delete it
    if (document.querySelector(".drawer") != null) {
        //If the one that is instantiated is the same as clicked --> remove without creating a new
        if (
            document.querySelector(".drawer .drawer-header h1").innerHTML ==
            node.name
        ) {
            document.querySelector(".drawer").remove();
            return;
        }
        document.querySelector(".drawer").remove();
    }

    const name = node.name;
    const area = node.area;
    const owner = node.owner;
    const description = node.description;
    const users = node.users;

    const usersHtml = () => {
        let string = ``;
        for (user in users) {
            string += `<h3>${users[user]}</h3>`;
        }
        return string;
    };

    //Template literal for drawer components
    const drawer = `
            <div class="drawer">
                <div class="drawer-header">
                    <h1>${name}</h1>
                    <h2>${area}</h2>
                </div>
            <hr>
                <div class="drawer-users">
                    <h2>Solution Owner</h2>
                    <h3>${owner}</h3>
                    ${users.length > 0 ? "<h2>Roles</h2>" : ""}
                    <div class="drawer-roles">
                      ${usersHtml()}
                    </div>
                </div>
            <hr>
                <div class="drawer-about">
                    <h2>About</h2>
                    <p>${description}</p>
                </div>
            <hr>
            </div>
            `;

    //Funkar typ samma som document.appendChild()
    document.body.insertAdjacentHTML("beforeend", drawer);
}

//All code relevant to graph initialisation and settings
const Graph = ForceGraph();

fetchJsonFile().then((gData) => {
    Graph(document.getElementById("graph"))
        .graphData(gData)
        .nodeId("name")
        .linkSource("source")
        .linkTarget("target")
        .nodeLabel("name")
        .nodeRelSize(24)
        .nodeAutoColorBy("area")
        .onNodeClick((node, event) => {
            createDrawer(node);
        })
});

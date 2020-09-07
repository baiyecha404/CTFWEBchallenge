async function getChildren(path) {
    try {
        let res = await fetch(`/api/directory/${path}`);
        return await res.json();
    } catch (error) {
        return [];
    }
}

function getPath(node) {
    if (typeof node.dataset.id === 'undefined') {
        return '';
    } else {
        return getPath(node.parentElement) + node.dataset.id + '/';
    }
}

async function editChild(node, id, value) {
    if (id == null) {
        return;
    }
    await fetch(`/api/directory/${getPath(node)}${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
    });
}

function removeChildren(node) {
    while (node.children.length > 1) {
        node.removeChild(node.children[1]);
    }
    node.classList.remove('open');
    node.classList.remove('empty');
}

async function showChildren(node) {
    node.onclick = null;
    let children = await getChildren(getPath(node));
    if (children.length === 0) {
        node.classList.add('empty');
        node.classList.remove('open');
    } else {
        node.classList.add('open');
        node.classList.remove('empty');
    }
    for (let child of children) {
        let childNode = document.createElement('div');
        childNode.classList.add('tree-node');
        childNode.dataset.id = child;
        childNode.innerHTML = `
            <div class="meta">
                <span class="name"></span>
                <span class="add">+</span>
            </div>
        `;
        let meta = childNode.children[0];
        let [ name, add ] = meta.children;
        name.textContent = child;
        name.onclick = () => {
            if (childNode.children.length === 1) {
                showChildren(childNode);
            } else {
                removeChildren(childNode);
            }
        }
        add.onclick = async () => {
            let newItem = prompt(getPath(childNode).replace(/\//g, ' > ') + '?');
            await editChild(childNode, newItem, {});
            removeChildren(childNode);
            await showChildren(childNode);
        };
        node.appendChild(childNode);
    }
}

showChildren(document.querySelector('.tree-node'));

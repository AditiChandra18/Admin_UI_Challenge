// Fetch user data from the API
fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
  .then(response => response.json())
  .then(data => {
    let users = data;
    let currentPage = 1;
    let rowsPerPage = 10;
    let selectedRows = [];

    const tableBody = document.querySelector('#userTable tbody');
    const searchInput = document.querySelector('#searchInput');
    const firstPageBtn = document.querySelector('#firstPageBtn');
    const previousPageBtn = document.querySelector('#previousPageBtn');
    const nextPageBtn = document.querySelector('#nextPageBtn');
    const lastPageBtn = document.querySelector('#lastPageBtn');
    const deleteSelectedBtn = document.querySelector('#deleteSelectedBtn');

    // Function to render the table rows
    function renderTable() {
      tableBody.innerHTML = '';

      // Apply pagination and filtering
      let filteredUsers = applySearchFilter(users);
      let totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      let startIndex = (currentPage - 1) * rowsPerPage;
      let endIndex = startIndex + rowsPerPage;

      let paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      // Render the rows
      for (let i = 0; i < paginatedUsers.length; i++) {
        let user = paginatedUsers[i];

        let row = document.createElement('tr');
        if (selectedRows.includes(user.id)) {
          row.classList.add('selected');
        }

        row.innerHTML = `
  <td><input type="checkbox" class="rowCheckbox" data-id="${user.id}"></td>
  <td>${user.id}</td>
  <td>${user.name}</td>
  <td>${user.email}</td>
  <td>${user.role}</td>
  <td><button class="editBtn">Edit</button></td>
  <td><button class="deleteBtn">Delete</button></td>
`;
      

        tableBody.appendChild(row);
      }

      // Enable/disable pagination buttons
      firstPageBtn.disabled = currentPage === 1;
      previousPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
      lastPageBtn.disabled = currentPage === totalPages;
    }

    // Apply search filter to the user data
    function applySearchFilter(users) {
      let query = searchInput.value.toLowerCase().trim();

      if (query === '') {
        return users;
      }

      return users.filter(user =>
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }

    // Event listeners for search input
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      renderTable();
    });

    // Event listeners for pagination buttons
    firstPageBtn.addEventListener('click', () => {
      currentPage = 1;
      renderTable();
    });

    previousPageBtn.addEventListener('click', () => {
      currentPage--;
      renderTable();
    });

    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      renderTable();
    });

    lastPageBtn.addEventListener('click', () => {
      currentPage = Math.ceil(users.length / rowsPerPage);
      renderTable();
    });

    // Event listener for delete selected button
    deleteSelectedBtn.addEventListener('click', () => {
      users = users.filter(user => !selectedRows.includes(user.id));
      selectedRows = [];
      renderTable();
    });

    // Event delegation for edit and delete buttons
    tableBody.addEventListener('click', event => {
      if (event.target.classList.contains('editBtn')) {
        // Handle edit button click
        let row = event.target.closest('tr');
        let id = row.querySelector('td:nth-child(2)').textContent;
        console.log('Edit ID:', id);
      } else if (event.target.classList.contains('deleteBtn')) {
        // Handle delete button click
        let row = event.target.closest('tr');
        let id = row.querySelector('td:nth-child(2)').textContent;
        console.log('Delete ID:', id);
      }
    });

    // Event delegation for checkbox selection
    tableBody.addEventListener('change', event => {
      if (event.target.classList.contains('rowCheckbox')) {
        let checkbox = event.target;
        let id = checkbox.dataset.id;
        if (checkbox.checked) {
          selectedRows.push(id);
          checkbox.closest('tr').classList.add('selected');
        } else {
          selectedRows = selectedRows.filter(rowId => rowId !== id);
          checkbox.closest('tr').classList.remove('selected');
        }
      }
    });

    tableBody.addEventListener('click', event => {
        if (event.target.classList.contains('editBtn')) {
          // Handle edit button click
          let row = event.target.closest('tr');
          let id = row.querySelector('td:nth-child(2)').textContent;
          console.log('Edit ID:', id);
          // TODO: Implement your edit logic here
        } else if (event.target.classList.contains('deleteBtn')) {
          // Handle delete button click
          let row = event.target.closest('tr');
          let id = row.querySelector('td:nth-child(2)').textContent;
          console.log('Delete ID:', id);
          // TODO: Implement your delete logic here
          users = users.filter(user => user.id !== id);
          selectedRows = selectedRows.filter(rowId => rowId !== id);
          renderTable();
        }
      });

    // Initial rendering of the table
    renderTable();
  });

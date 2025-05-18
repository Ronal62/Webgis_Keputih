<?php 
include 'header.php'; 
?>

<main class="main">

    <!-- Page Title -->
    <div class="page-title dark-background" data-aos="fade" style="background-image: url(assets/img/3.png);">
      <div class="container position-relative">
        <h1>SATU PETA KEPUTIH</h1>
        <p>INFORMASI SPASIAL DAN INVENTARIS OBJEK RUPA BUMI</p>
        <nav class="breadcrumbs">
          <ol>
            <li><a href="index.php">Home</a></li>
            <li class="current">Peta & Titik Kartometrik</li>
          </ol>
        </nav>
      </div>
    </div><!-- End Page Title -->           

    <!-- Starter Section Section -->
    <section id="starter-section" class="starter-section section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Peta & Titik Kartometrik</h2>
        <p>Peta & Titik Kartometrik<br></p>
      </div><!-- End Section Title -->

      <!-- Table with Search and Pagination -->
      <div class="container" data-aos="fade-up">
        <style>
          .table-rounded {
            border-radius: 10px;
            overflow: hidden;
          }
          .table-rounded thead th {
            background-color: #343a40;
            color: white;
          }
          .table-rounded tbody tr:last-child td {
            border-bottom: none;
          }
          .pagination {
            justify-content: center;
            margin-top: 20px;
          }
          .page-item.active .page-link {
            background-color: #007bff;
            border-color: #007bff;
          }
          .page-link {
            color: #007bff;
          }
          .page-link:hover {
            color: #0056b3;
            background-color: #e9ecef;
          }
          .search-container {
            max-width: 500px;
            margin: 0 auto 20px;
            position: relative;
          }
          .clear-search {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #6c757d;
            cursor: pointer;
            display: none;
          }
          .clear-search:hover {
            color: #343a40;
          }
          .input-group .form-control {
            border-radius: 5px 0 0 5px;
          }
          .input-group .btn {
            border-radius: 0 5px 5px 0;
          }
        </style>

        <?php
        // Include database connection
        include 'koneksi.php';

        // Pagination variables
        $limit = 10; // Number of rows per page
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $start = ($page - 1) * $limit;

        // Search variable
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $search_query = '';
        if ($search !== '') {
            $search = $conn->real_escape_string($search);
            $search_query = " WHERE kode_patok LIKE '%$search%' OR berbatasan_dengan LIKE '%$search%'";
        }

        // Query to get total number of rows (with search filter)
        $total_query = "SELECT COUNT(*) as total FROM patok" . $search_query;
        $total_result = $conn->query($total_query);
        $total_row = $total_result->fetch_assoc();
        $total_rows = $total_row['total'];
        $total_pages = ceil($total_rows / $limit);

        // Query to fetch data with limit, offset, and search filter
        $sql = "SELECT kode_patok, berbatasan_dengan, longitude, latitude, link_foto FROM patok" . $search_query . " LIMIT $start, $limit";
        $result = $conn->query($sql);

        // Calculate starting number for "No" column
        $no = $start + 1;
        ?>

        <!-- Search Bar -->
        <div class="search-container">
          <form method="GET" action="">
            <div class="input-group">
              <input type="text" name="search" class="form-control" placeholder="Cari Kode Patok atau Berbatasan Dengan..." value="<?php echo htmlspecialchars($search); ?>" id="searchInput">
              <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i></button>
              <button type="button" class="clear-search" id="clearSearch" onclick="clearSearch()">&times;</button>
            </div>
          </form>
        </div>

        <table class="table table-striped table-bordered table-rounded">
          <thead class="table-dark">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Kode Patok</th>
              <th scope="col">Berbatasan Dengan</th>
              <th scope="col">Longitude</th>
              <th scope="col">Latitude</th>
              <th scope="col">Link Foto</th>
            </tr>
          </thead>
          <tbody>
            <?php
            // Check if data exists
            if ($result->num_rows > 0) {
              // Loop through each row
              while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $no++ . "</td>";
                echo "<td>" . htmlspecialchars($row['kode_patok']) . "</td>";
                echo "<td>" . htmlspecialchars($row['berbatasan_dengan']) . "</td>";
                echo "<td>" . htmlspecialchars($row['longitude']) . "</td>";
                echo "<td>" . htmlspecialchars($row['latitude']) . "</td>";
                echo "<td><a href='" . htmlspecialchars($row['link_foto']) . "' target='_blank'>" . htmlspecialchars($row['link_foto']) . "</a></td>";
                echo "</tr>";
              }
            } else {
              echo "<tr><td colspan='6' class='text-center'>Tidak ada data ditemukan</td></tr>";
            }

            // Close connection
            $conn->close();
            ?>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <?php
            // Previous button
            if ($page > 1) {
              echo "<li class='page-item'><a class='page-link' href='?page=" . ($page - 1) . "&search=" . urlencode($search) . "'>Previous</a></li>";
            } else {
              echo "<li class='page-item disabled'><span class='page-link'>Previous</span></li>";
            }

            // Page numbers
            for ($i = 1; $i <= $total_pages; $i++) {
              echo "<li class='page-item " . ($i == $page ? 'active' : '') . "'>";
              echo "<a class='page-link' href='?page=$i&search=" . urlencode($search) . "'>$i</a>";
              echo "</li>";
            }

            // Next button
            if ($page < $total_pages) {
              echo "<li class='page-item'><a class='page-link' href='?page=" . ($page + 1) . "&search=" . urlencode($search) . "'>Next</a></li>";
            } else {
              echo "<li class='page-item disabled'><span class='page-link'>Next</span></li>";
            }
            ?>
          </ul>
        </nav>
      </div>

    </section><!-- /Starter Section Section -->

</main>

<script>
  // Show/hide clear button based on input
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');

  searchInput.addEventListener('input', function() {
    clearSearch.style.display = this.value ? 'block' : 'none';
  });

  // Clear search input and redirect
  function clearSearch() {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    window.location.href = '?page=1';
  }

  // Initialize clear button visibility
  clearSearch.style.display = searchInput.value ? 'block' : 'none';
</script>

<?php include 'footer.php'; ?>
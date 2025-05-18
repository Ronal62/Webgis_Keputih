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
          .table-section {
            margin-bottom: 40px;
          }
        </style>

        <!-- Table 1: Patok Data -->
        <div class="table-section">
          <h3 class="text-center mb-3">Tabel Patok</h3>
          <?php
          // Pagination variables for table 1
          $limit = 10; // Number of rows per page
          $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
          $start = ($page - 1) * $limit;

          // Search variable for table 1
          $search = isset($_GET['search']) ? trim($_GET['search']) : '';

          // Fetch data from MockAPI for table 1
          $url = 'https://682a6bfaab2b5004cb36ab35.mockapi.io/webgis/webgis';
          $ch = curl_init();
          curl_setopt($ch, CURLOPT_URL, $url);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
          $response = curl_exec($ch);
          $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
          curl_close($ch);

          $data = [];
          if ($http_code == 200 && $response !== false) {
              $data = json_decode($response, true);
          }

          // Filter data based on search for table 1
          $filtered_data = $data;
          if ($search !== '') {
              $filtered_data = array_filter($data, function($row) use ($search) {
                  return stripos($row['kode_patok'], $search) !== false || 
                         stripos($row['berbatasan_dengan'], $search) !== false;
              });
              $filtered_data = array_values($filtered_data); // Reindex array
          }

          // Pagination calculations for table 1
          $total_rows = count($filtered_data);
          $total_pages = ceil($total_rows / $limit);

          // Slice data for current page for table 1
          $paged_data = array_slice($filtered_data, $start, $limit);

          // Calculate starting number for "No" column
          $no = $start + 1;
          ?>

          <!-- Search Bar for Table 1 -->
          <div class="search-container">
            <form method="GET" action="">
              <div class="input-group">
                <input type="text" name="search" class="form-control" placeholder="Cari Kode Patok atau Berbatasan Dengan..." value="<?php echo htmlspecialchars($search); ?>" id="searchInput">
                <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i></button>
                <button type="button" class="clear-search" id="clearSearch" onclick="clearSearch()">×</button>
                <input type="hidden" name="page" value="1">
                <input type="hidden" name="search2" value="<?php echo htmlspecialchars(isset($_GET['search2']) ? $_GET['search2'] : ''); ?>">
                <input type="hidden" name="page2" value="<?php echo htmlspecialchars(isset($_GET['page2']) ? $_GET['page2'] : '1'); ?>">
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
              // Check if data exists for table 1
              if (!empty($paged_data)) {
                // Loop through each row
                foreach ($paged_data as $row) {
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
              ?>
            </tbody>
          </table>

          <!-- Pagination Controls for Table 1 -->
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <?php
              // Previous button
              if ($page > 1) {
                echo "<li class='page-item'><a class='page-link' href='?page=" . ($page - 1) . "&search=" . urlencode($search) . "&search2=" . urlencode(isset($_GET['search2']) ? $_GET['search2'] : '') . "&page2=" . (isset($_GET['page2']) ? $_GET['page2'] : '1') . "'>Previous</a></li>";
              } else {
                echo "<li class='page-item disabled'><span class='page-link'>Previous</span></li>";
              }

              // Page numbers
              for ($i = 1; $i <= $total_pages; $i++) {
                echo "<li class='page-item " . ($i == $page ? 'active' : '') . "'>";
                echo "<a class='page-link' href='?page=$i&search=" . urlencode($search) . "&search2=" . urlencode(isset($_GET['search2']) ? $_GET['search2'] : '') . "&page2=" . (isset($_GET['page2']) ? $_GET['page2'] : '1') . "'>$i</a>";
                echo "</li>";
              }

              // Next button
              if ($page < $total_pages) {
                echo "<li class='page-item'><a class='page-link' href='?page=" . ($page + 1) . "&search=" . urlencode($search) . "&search2=" . urlencode(isset($_GET['search2']) ? $_GET['search2'] : '') . "&page2=" . (isset($_GET['page2']) ? $_GET['page2'] : '1') . "'>Next</a></li>";
              } else {
                echo "<li class='page-item disabled'><span class='page-link'>Next</span></li>";
              }
              ?>
            </ul>
          </nav>
        </div>

        <!-- Table 2: Objek Rupa Bumi Data -->
        <div class="table-section">
          <h3 class="text-center mb-3">Tabel Objek Rupa Bumi</h3>
          <?php
          // Pagination variables for table 2
          $limit2 = 10; // Number of rows per page
          $page2 = isset($_GET['page2']) ? (int)$_GET['page2'] : 1;
          $start2 = ($page2 - 1) * $limit2;

          // Search variable for table 2
          $search2 = isset($_GET['search2']) ? trim($_GET['search2']) : '';

          // Fetch data from MockAPI for table 2
          $url2 = 'https://682a6bfaab2b5004cb36ab35.mockapi.io/webgis/webgis2';
          $ch2 = curl_init();
          curl_setopt($ch2, CURLOPT_URL, $url2);
          curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch2, CURLOPT_FOLLOWLOCATION, true);
          $response2 = curl_exec($ch2);
          $http_code2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
          curl_close($ch2);

          $data2 = [];
          if ($http_code2 == 200 && $response2 !== false) {
              $data2 = json_decode($response2, true);
          }

          // Filter data based on search for table 2
          $filtered_data2 = $data2;
          if ($search2 !== '') {
              $filtered_data2 = array_filter($data2, function($row) use ($search2) {
                  return stripos($row['Nama Objek Rupa Bumi'], $search2) !== false || 
                         stripos($row['Jenis Objek Rupa Bumi'], $search2) !== false;
              });
              $filtered_data2 = array_values($filtered_data2); // Reindex array
          }

          // Pagination calculations for table 2
          $total_rows2 = count($filtered_data2);
          $total_pages2 = ceil($total_rows2 / $limit2);

          // Slice data for current page for table 2
          $paged_data2 = array_slice($filtered_data2, $start2, $limit2);

          // Calculate starting number for "No" column
          $no2 = $start2 + 1;
          ?>

          <!-- Search Bar for Table 2 -->
          <div class="search-container">
            <form method="GET" action="">
              <div class="input-group">
                <input type="text" name="search2" class="form-control" placeholder="Cari Nama Objek atau Jenis Objek..." value="<?php echo htmlspecialchars($search2); ?>" id="searchInput2">
                <button type="submit" class="btn btn-primary"><i class="bi bi-search"></i></button>
                <button type="button" class="clear-search" id="clearSearch2" onclick="clearSearch2()">×</button>
                <input type="hidden" name="page2" value="1">
                <input type="hidden" name="search" value="<?php echo htmlspecialchars($search); ?>">
                <input type="hidden" name="page" value="<?php echo htmlspecialchars($page); ?>">
              </div>
            </form>
          </div>

          <table class="table table-striped table-bordered table-rounded">
            <thead class="table-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Objek Rupa Bumi</th>
                <th scope="col">Longitude</th>
                <th scope="col">Latitude</th>
                <th scope="col">Deskripsi Objek</th>
                <th scope="col">Kondisi</th>
                <th scope="col">Status</th>
                <th scope="col">Keterangan</th>
                <th scope="col">Jenis Objek Rupa Bumi</th>
                <th scope="col">Link Drive Foto</th>
              </tr>
            </thead>
            <tbody>
              <?php
              // Check if data exists for table 2
              if (!empty($paged_data2)) {
                // Loop through each row
                foreach ($paged_data2 as $row) {
                  echo "<tr>";
                  echo "<td>" . $no2++ . "</td>";
                  echo "<td>" . htmlspecialchars($row['Nama Objek Rupa Bumi']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Longitude']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Latitude']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Deskripsi Objek']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Kondisi']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Status']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Keterangan']) . "</td>";
                  echo "<td>" . htmlspecialchars($row['Jenis Objek Rupa Bumi']) . "</td>";
                  echo "<td><a href='" . htmlspecialchars($row['Link Drive Foto dengan Geotagging']) . "' target='_blank'>" . htmlspecialchars($row['Link Drive Foto dengan Geotagging']) . "</a></td>";
                  echo "</tr>";
                }
              } else {
                echo "<tr><td colspan='10' class='text-center'>Tidak ada data ditemukan</td></tr>";
              }
              ?>
            </tbody>
          </table>

          <!-- Pagination Controls for Table 2 -->
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <?php
              // Previous button
              if ($page2 > 1) {
                echo "<li class='page-item'><a class='page-link' href='?page2=" . ($page2 - 1) . "&search2=" . urlencode($search2) . "&search=" . urlencode($search) . "&page=" . $page . "'>Previous</a></li>";
              } else {
                echo "<li class='page-item disabled'><span class='page-link'>Previous</span></li>";
              }

              // Page numbers
              for ($i = 1; $i <= $total_pages2; $i++) {
                echo "<li class='page-item " . ($i == $page2 ? 'active' : '') . "'>";
                echo "<a class='page-link' href='?page2=$i&search2=" . urlencode($search2) . "&search=" . urlencode($search) . "&page=" . $page . "'>$i</a>";
                echo "</li>";
              }

              // Next button
              if ($page2 < $total_pages2) {
                echo "<li class='page-item'><a class='page-link' href='?page2=" . ($page2 + 1) . "&search2=" . urlencode($search2) . "&search=" . urlencode($search) . "&page=" . $page . "'>Next</a></li>";
              } else {
                echo "<li class='page-item disabled'><span class='page-link'>Next</span></li>";
              }
              ?>
            </ul>
          </nav>
        </div>

      </div>

    </section><!-- /Starter Section Section -->

</main>

<script>
  // Show/hide clear button for table 1
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  searchInput.addEventListener('input', function() {
    clearSearch.style.display = this.value ? 'block' : 'none';
  });
  function clearSearch() {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    window.location.href = '?page=1&search2=' + encodeURIComponent('<?php echo htmlspecialchars(isset($_GET['search2']) ? $_GET['search2'] : ''); ?>') + '&page2=' + encodeURIComponent('<?php echo htmlspecialchars(isset($_GET['page2']) ? $_GET['page2'] : '1'); ?>');
  }
  clearSearch.style.display = searchInput.value ? 'block' : 'none';

  // Show/hide clear button for table 2
  const searchInput2 = document.getElementById('searchInput2');
  const clearSearch2 = document.getElementById('clearSearch2');
  searchInput2.addEventListener('input', function() {
    clearSearch2.style.display = this.value ? 'block' : 'none';
  });
  function clearSearch2() {
    searchInput2.value = '';
    clearSearch2.style.display = 'none';
    window.location.href = '?page2=1&search=' + encodeURIComponent('<?php echo htmlspecialchars($search); ?>') + '&page=' + encodeURIComponent('<?php echo htmlspecialchars($page); ?>');
  }
  clearSearch2.style.display = searchInput2.value ? 'block' : 'none';
</script>

<?php include 'footer.php'; ?>
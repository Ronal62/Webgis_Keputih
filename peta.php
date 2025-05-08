<?php 
$page_title = 'Peta & Titik Kartometrik - Dewi Bootstrap Template';
include 'header.php'; 
?>

<main class="main">

    <!-- Page Title -->
    <div class="page-title dark-background" data-aos="fade" style="background-image: url(assets/img/3.png);">
      <div class="container position-relative">
        <h1>Peta & Titik Kartometrik</h1>
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

      <div class="container map-container" data-aos="fade-up">
        <div class="toggle-container text-center">
            <div class="form-check form-switch d-inline-block me-4">
                <input class="form-check-input" type="checkbox" id="toggle-batas-kelurahan" checked>
                <label class="form-check-label" for="toggle-batas-kelurahan">Batas Kelurahan</label>
            </div>
            <div class="form-check form-switch d-inline-block me-4">
                <input class="form-check-input" type="checkbox" id="toggle-batas-rw" checked>
                <label class="form-check-label" for="toggle-batas-rw">Batas RW</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-batas-rt" checked>
                <label class="form-check-label" for="toggle-batas-rt">Batas RT</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-batas-patok-batas-keputih" checked>
                <label class="form-check-label" for="toggle-batas-patok-batas-keputih">Patok Batas Keputih</label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="toggle-inventarisasi" checked>
                <label class="form-check-label" for="toggle-inventarisasi">Inventarisasi</label>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="map-container">
                    <div id="batas-kelurahan"></div>
                </div>
            </div>
        </div>
      </div>

    </section><!-- /Starter Section Section -->

</main>

<?php include 'footer.php'; ?>
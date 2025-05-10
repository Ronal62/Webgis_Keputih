<?php 
include 'header.php'; 
?>

<main class="main">

    <!-- Page Title -->
    <div class="page-title dark-background" data-aos="fade" style="background-image: url(assets/img/3.png);">
      <div class="container position-relative">
        <h1>INVENTARIS</h1>
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
        <h2>Inventarisasi</h2>
        <p>Inventarisasi Objek Rupa Bumi<br></p>
      </div><!-- End Section Title -->

      <div class="container map-container" data-aos="fade-up">
        <div class="toggle-container text-center">
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-kebudayaan" checked>
                <label class="form-check-label" for="toggle-kebudayaan">Kebudayaan</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-perhubungan" checked>
                <label class="form-check-label" for="toggle-perhubungan">Perhubungan</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-pariwisata" checked>
                <label class="form-check-label" for="toggle-pariwisata">Pariwisata</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-telekomunikasi" checked>
                <label class="form-check-label" for="toggle-telekomunikasi">Telekomunikasi</label>
            </div>
            <div class="form-check form-switch d-inline-block">
                <input class="form-check-input" type="checkbox" id="toggle-sekolah-non-formal" checked>
                <label class="form-check-label" for="toggle-sekolah-non-formal">Sekolah Non Formal</label>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="map-container">
                    <div id="inventarisasi" style="height: 600px;"></div> <!-- Added inline height -->
                </div>
            </div>
        </div>
      </div>

    </section><!-- /Starter Section Section -->

    

</main>

<?php include 'footer.php'; ?>
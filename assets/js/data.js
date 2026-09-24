/**
 * data.js - Data Provider & Fallback Data untuk Informatika SMA Learning Hub
 */

const FALLBACK_MATERIALS = [
  {
    "id": "informatika-kelas-10-p1",
    "classLevel": "10",
    "meeting": 1,
    "title": "Pengenalan Teknologi Informasi & Informatika",
    "category": "Dasar Informatika",
    "description": "Mengenal pengertian dasar Informatika, ruang lingkup bidang studinya, serta peranan Teknologi Informasi dalam kehidupan modern.",
    "duration": "45 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-10/pertemuan-01/Materi-Pertemuan-1-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Menjelaskan pengertian dasar Informatika dan Teknologi Informasi",
        "Mengidentifikasi 8 bidang kajian utama Informatika di SMA",
        "Memahami manfaat mempelajari Informatika untuk masa depan digital"
      ],
      "sections": [
        {
          "heading": "Pengertian Teknologi Informasi & Informatika",
          "paragraphs": [
            "Informatika adalah disiplin ilmu sains yang mempelajari pengolahan data dan informasi menggunakan sistem komputasi.",
            "Teknologi Informasi (TI) merupakan sarana dan alat berbasis perangkat keras dan lunak yang digunakan untuk membuat, menyimpan, mengubah, dan menyebarkan informasi."
          ]
        },
        {
          "heading": "Ruang Lingkup Informatika SMA",
          "paragraphs": [
            "Ruang lingkup mencakup Berpikir Komputasional, Sistem Komputer, Jaringan Komputer, Analisis Data, Pemrograman, Dampak Sosial Informatika, dan TIK."
          ]
        }
      ],
      "keyPoints": [
        "Informatika adalah ilmu sains pengolahan informasi berbasis sistem komputasi.",
        "Teknologi Informasi mendukung efisiensi pengolahan dan penyebaran data."
      ]
    }
  },
  {
    "id": "informatika-kelas-10-p2",
    "classLevel": "10",
    "meeting": 2,
    "title": "Pemrosesan & Penyimpanan Komputer",
    "category": "Sistem Komputer",
    "description": "Memahami arsitektur pemrosesan data oleh CPU, jenis-jenis memori utama (RAM/ROM), dan media penyimpanan sekunder.",
    "duration": "45 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-10/pertemuan-02/Materi-Pertemuan-2-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Menjelaskan alur pemrosesan data pada CPU (ALU dan Control Unit)",
        "Membedakan memori volatile (RAM) dan non-volatile (SSD/HDD)",
        "Mengidentifikasi hierarki kecepatan dan kapasitas media penyimpanan"
      ],
      "sections": [
        {
          "heading": "Prosesor dan Eksekusi Instruksi",
          "paragraphs": [
            "Central Processing Unit (CPU) mengolah instruksi data yang dikirim dari memori utama melalui siklus Fetch, Decode, Execute, dan Store."
          ]
        },
        {
          "heading": "Memori Utama dan Penyimpanan Sekunder",
          "paragraphs": [
            "RAM menyimpan data kerja sementara saat komputer menyala, sedangkan SSD/HDD menyimpan data secara permanen."
          ]
        }
      ],
      "keyPoints": [
        "CPU adalah pusat pengolah aritmetika dan kontrol logika komputer.",
        "RAM bersifat volatile, SSD/HDD bersifat non-volatile."
      ]
    }
  },
  {
    "id": "informatika-kelas-10-p3",
    "classLevel": "10",
    "meeting": 3,
    "title": "Sistem Operasi & Manajemen File",
    "category": "Sistem Komputer",
    "description": "Mengenal peran sistem operasi (OS), pengorganisasian direktori folder, ekstensi file, dan aturan hak akses berkas.",
    "duration": "40 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-10/pertemuan-03/Materi-Pertemuan-3-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Menjelaskan fungsi Sistem Operasi dalam mengelola hardware dan software",
        "Mengelola struktur direktori folder dengan rapi dan kontekstual",
        "Mengenal berbagai jenis ekstensi file dan tipe data"
      ],
      "sections": [
        {
          "heading": "Fungsi Dasar Sistem Operasi",
          "paragraphs": [
            "Sistem Operasi menyediakan antarmuka bagi pengguna serta mengelola penjadwalan CPU, alokasi memori, dan akses peranti I/O."
          ]
        },
        {
          "heading": "Manajemen Struktur Direktori",
          "paragraphs": [
            "Pengorganisasian berkas menggunakan hierarki pohon direktori membantu mempercepat pencarian data dan menghindari kehilangan berkas."
          ]
        }
      ],
      "keyPoints": [
        "OS adalah pengelola utama seluruh perangkat dan program di komputer.",
        "Struktur folder hierarkis menjaga kerapian data."
      ]
    }
  },
  {
    "id": "informatika-kelas-10-p4",
    "classLevel": "10",
    "meeting": 4,
    "title": "Jaringan Komputer & Internet",
    "category": "Jaringan Komputer",
    "description": "Memahami konsep dasar jaringan komputer, cakupan LAN/WAN, fungsi IP address, dan cara kerja internet.",
    "duration": "50 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-10/pertemuan-04/Materi-Pertemuan-4-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Membedakan jenis jaringan berdasarkan area geografis (LAN, MAN, WAN)",
        "Memahami fungsi IP Address sebagai identitas perangkat di jaringan",
        "Menjelaskan peran router dan protokol komunikasi internet"
      ],
      "sections": [
        {
          "heading": "Konsep Jaringan & Skala Geografis",
          "paragraphs": [
            "Jaringan komputer memungkinkan dua atau lebih perangkat terhubung untuk berbagi data dan sumber daya."
          ]
        },
        {
          "heading": "Pengalamatan IP & Routing Data",
          "paragraphs": [
            "IP Address bertindak sebagai alamat tujuan pengiriman paket data yang diarahkan oleh router di seluruh dunia."
          ]
        }
      ],
      "keyPoints": [
        "LAN untuk area terbatas, WAN untuk jangkauan global internet.",
        "IP Address adalah alamat unik setiap komputer di jaringan."
      ]
    }
  },
  {
    "id": "informatika-kelas-10-p5",
    "classLevel": "10",
    "meeting": 5,
    "title": "Keamanan Digital",
    "category": "Keamanan Digital",
    "description": "Mengenal pentingnya menjaga privasi identitas online, bahaya kejahatan siber (phishing & malware), dan otentikasi akun.",
    "duration": "40 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-10/pertemuan-05/Materi-Pertemuan-5-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Mengidentifikasi ancaman siber seperti Phishing, Ransomware, dan Social Engineering",
        "Menerapkan pembuatan kata sandi kuat dan otentikasi 2 faktor (2FA)",
        "Memahami konsep rekam jejak digital (digital footprint)"
      ],
      "sections": [
        {
          "heading": "Ancaman Keamanan Siber Popular",
          "paragraphs": [
            "Phishing berusaha memancing data kredensial rahasia pengguna melalui situs web atau email palsu yang menyerupai institusi resmi."
          ]
        },
        {
          "heading": "Proteksi Identitas & Sandi Kuat",
          "paragraphs": [
            "Aktifkan Otentikasi Dua Faktor (2FA) dan perbarui kata sandi secara berkala menggunakan kombinasi huruf, angka, dan simbol."
          ]
        }
      ],
      "keyPoints": [
        "Waspadai tautan Phishing dan rekayasa sosial.",
        "Gunakan sandi unik dan aktifkan fitur keamanan 2FA."
      ]
    }
  },
  {
    "id": "informatika-kelas-10-p6",
    "classLevel": "10",
    "meeting": 6,
    "title": "Berpikir Komputasional",
    "category": "Berpikir Komputasional",
    "description": "Pengenalan konsep berpikir komputasional untuk menyelesaikan masalah secara sistematis melalui 4 pilar utama.",
    "duration": "45 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-10/pertemuan-06/Materi-Pertemuan-6-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Memahami konsep dasar Berpikir Komputasional",
        "Mengenal tahapan Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-10-p7",
    "classLevel": "10",
    "meeting": 7,
    "title": "Analisis Data Dasar",
    "category": "Analisis Data",
    "description": "Pengenalan pemrosesan data kategorikal dan numerik sederhana menggunakan lembar kerja spreadsheet.",
    "duration": "45 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-10/pertemuan-07/Materi-Pertemuan-7-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Memahami konsep pengolahan data mentah",
        "Mengenal fungsi dasar spreadsheet"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-10-p8",
    "classLevel": "10",
    "meeting": 8,
    "title": "Algoritma & Pemrograman Dasar",
    "category": "Algoritma & Pemrograman",
    "description": "Mengenal logika algoritma runtutan, percabangan, dan perulangan dasar menggunakan bahasa pemrograman Python.",
    "duration": "50 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-10/pertemuan-08/Materi-Pertemuan-8-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Memahami struktur variabel dan tipe data",
        "Mengenal sintaks percabangan dasar"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-10-p9",
    "classLevel": "10",
    "meeting": 9,
    "title": "Dampak Sosial Informatika",
    "category": "Dampak Sosial Informatika",
    "description": "Memahami etika digital, hukum UU ITE, dan dampak transformasi teknologi komputasi terhadap masyarakat.",
    "duration": "40 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-10/pertemuan-09/Materi-Pertemuan-9-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Memahami prinsip kewargaan digital",
        "Mengetahui dampak positif dan negatif teknologi"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-10-p10",
    "classLevel": "10",
    "meeting": 10,
    "title": "TIK dan Aplikasi Perkantoran",
    "category": "TIK & Aplikasi",
    "description": "Pengenalan integrasi paket aplikasi perkantoran seperti pengolah kata (Word), pengolah angka (Excel), dan presentasi (PowerPoint).",
    "duration": "45 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-10/pertemuan-10/Materi-Pertemuan-10-kelas-10.docx"
    },
    "content": {
      "objectives": [
        "Mengenal fungsi utama aplikasi perkantoran",
        "Memahami pembuatan dokumen dan lembar kerja dasar"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-11-12-p1",
    "classLevel": "11-12",
    "meeting": 1,
    "title": "Pengantar Jaringan Komputer",
    "category": "Jaringan Komputer",
    "description": "Memahami konsep dasar komunikasi data antar komputer, arsitektur jaringan client-server, dan peer-to-peer.",
    "duration": "45 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-11-12/pertemuan-01/Materi-Pertemuan-1-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami definisi dan manfaat jaringan komputer",
        "Membedakan model arsitektur Client-Server dan Peer-to-Peer",
        "Mengenal komponen dasar pembentuk jaringan"
      ],
      "sections": [
        {
          "heading": "Pengertian & Konsep Jaringan Komputer",
          "paragraphs": [
            "Jaringan komputer adalah sistem yang terdiri dari komputer dan perangkat jaringan yang dihubungkan bersama untuk berbagi data, aplikasi, dan sumber daya perangkat keras."
          ]
        },
        {
          "heading": "Model Arsitektur Jaringan",
          "paragraphs": [
            "Model Client-Server memusatkan layanan pada server terdedikasi, sedangkan Peer-to-Peer memungkinkan setiap komputer saling bertukar data secara setara."
          ]
        }
      ],
      "keyPoints": [
        "Jaringan komputer mempermudah komunikasi dan berbagi sumber daya.",
        "Client-Server memiliki pusat kontrol, Peer-to-Peer bersifat desentralisasi."
      ]
    }
  },
  {
    "id": "informatika-kelas-11-12-p2",
    "classLevel": "11-12",
    "meeting": 2,
    "title": "Jenis & Topologi Jaringan",
    "category": "Jaringan Komputer",
    "description": "Menganalisis berbagai bentuk topologi jaringan fisik (Star, Bus, Ring, Mesh) beserta kelebihan dan kekurangannya.",
    "duration": "50 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-11-12/pertemuan-02/Materi-Pertemuan-2-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami skema denah topologi jaringan fisik dan logika",
        "Menganalisis kelebihan dan kekurangan topologi Star, Bus, Ring, dan Mesh",
        "Memilih topologi yang sesuai untuk kebutuhan laboratorium atau kantor"
      ],
      "sections": [
        {
          "heading": "Pengertian Topologi Jaringan",
          "paragraphs": [
            "Topologi jaringan menggambarkan bentuk hubungan interkoneksi fisik antar simpul komputer dalam satu jaringan."
          ]
        },
        {
          "heading": "Karakteristik Topologi Star dan Mesh",
          "paragraphs": [
            "Topologi Star menggunakan Switch/Hub pusat dan paling populer karena mudah di-troubleshoot. Topologi Mesh menyediakan jalur redundant tinggi tetapi membutuhkan banyak kabel."
          ]
        }
      ],
      "keyPoints": [
        "Topologi Star paling umum digunakan karena kemudahan manajemen.",
        "Topologi Mesh menawarkan keandalan jalur komunikasi tertinggi."
      ]
    }
  },
  {
    "id": "informatika-kelas-11-12-p3",
    "classLevel": "11-12",
    "meeting": 3,
    "title": "Perangkat Jaringan & Media Transmisi",
    "category": "Jaringan Komputer",
    "description": "Mengenal perangkat keras jaringan (Switch, Router, Access Point) serta media kabel (UTP/Fibre) dan nirkabel (Wi-Fi).",
    "duration": "50 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-11-12/pertemuan-03/Materi-Pertemuan-3-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Mengidentifikasi fungsi Switch, Router, Modem, dan Access Point",
        "Membedakan karakteristik media transmisi terpandu (kabel UTP, Fiber Optik)",
        "Memahami prinsip kerja komunikasi nirkabel (Wireless Wi-Fi)"
      ],
      "sections": [
        {
          "heading": "Perangkat Keras Jaringan Komputer",
          "paragraphs": [
            "Switch menghubungkan perangkat dalam satu LAN lokal (Data Link layer), sedangkan Router menghubungkan antar jaringan berbeda (Network layer)."
          ]
        },
        {
          "heading": "Media Transmisi Kabel & Wireless",
          "paragraphs": [
            "Kabel UTP (Twisted Pair) umum digunakan untuk jarak pendek LAN, sedangkan Fiber Optik mentransmisikan data dalam bentuk cahaya untuk kecepatan tinggi jarak jauh."
          ]
        }
      ],
      "keyPoints": [
        "Switch untuk LAN lokal, Router untuk menghubungkan antar sub-jaringan.",
        "Fiber Optik adalah media kabel tercepat berteknologi gelombang cahaya."
      ]
    }
  },
  {
    "id": "informatika-kelas-11-12-p4",
    "classLevel": "11-12",
    "meeting": 4,
    "title": "IP Address & Subnetting Dasar",
    "category": "Jaringan Komputer",
    "description": "Mempelajari struktur pengalamatan IPv4, pembagian kelas IP, subnet mask, dan perhitungan subnetting dasar.",
    "duration": "55 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-11-12/pertemuan-04/Materi-Pertemuan-4-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami format IPv4 32-bit (Network ID dan Host ID)",
        "Membedakan Kelas A, B, dan C IP Address",
        "Menghitung jumlah host dan alokasi subnet mask"
      ],
      "sections": [
        {
          "heading": "Struktur Alamat IP (IPv4)",
          "paragraphs": [
            "IPv4 terdiri dari 4 oktet desimal (contoh 192.168.1.1) yang terbagi menjadi porsi alamat jaringan (Network ID) dan alamat host (Host ID)."
          ]
        },
        {
          "heading": "Dasar Perhitungan Subnetting",
          "paragraphs": [
            "Subnetting membagi satu jaringan besar menjadi beberapa sub-jaringan yang lebih kecil dan efisien untuk mengurangi lalu lintas broadcast."
          ]
        }
      ],
      "keyPoints": [
        "IPv4 menggunakan format 32-bit terbagi dalam 4 oktet.",
        "Subnetting meningkatkan efisiensi dan keamanan lalu lintas data."
      ]
    }
  },
  {
    "id": "informatika-kelas-11-12-p5",
    "classLevel": "11-12",
    "meeting": 5,
    "title": "Konfigurasi Jaringan Sederhana",
    "category": "Jaringan Komputer",
    "description": "Praktik pengesetan IP statis dan dinamis (DHCP) pada perangkat komputer serta pengujian koneksi menggunakan perintah Ping.",
    "duration": "50 menit",
    "locked": false,
    "document": {
      "available": true,
      "file": "assets/materials/kelas-11-12/pertemuan-05/Materi-Pertemuan-5-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Melakukan konfigurasi IP Address Statis pada Operating System",
        "Memahami pengalokasian IP Otomatis menggunakan layanan DHCP Server",
        "Menguji konektivitas antar komputer menggunakan utilitas command line `ping`"
      ],
      "sections": [
        {
          "heading": "Pengesetan IP Statis vs DHCP",
          "paragraphs": [
            "Konfigurasi IP Statis dimasukkan secara manual untuk peranti penting seperti server, sedangkan DHCP membagikan alamat IP secara otomatis kepada klien."
          ]
        },
        {
          "heading": "Pengujian Koneksi dengan Perintah Ping",
          "paragraphs": [
            "Perintah `ping [IP_Tujuan]` mengirimkan paket ICMP Echo Request untuk memverifikasi apakah Komputer B merespon sinyal dari Komputer A."
          ]
        }
      ],
      "keyPoints": [
        "DHCP memudahkan alokasi IP otomatis pada banyak komputer.",
        "Perintah `ping` menguji respon dan latensi koneksi jaringan."
      ]
    }
  },
  {
    "id": "informatika-kelas-11-12-p6",
    "classLevel": "11-12",
    "meeting": 6,
    "title": "Keamanan Jaringan",
    "category": "Keamanan Digital",
    "description": "Memahami konsep perlindungan firewall, inspeksi paket data, enkripsi Wi-Fi (WPA2/WPA3), dan pencegahan akses tak berizin.",
    "duration": "50 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-11-12/pertemuan-06/Materi-Pertemuan-6-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami fungsi Firewall dalam menyaring lalu lintas jaringan",
        "Mengenal standar enkripsi jaringan nirkabel Wi-Fi"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-11-12-p7",
    "classLevel": "11-12",
    "meeting": 7,
    "title": "Koneksi dan Berbagi Sumber Daya dalam Jaringan",
    "category": "Jaringan Komputer",
    "description": "Pengenalan prosedur berbagai berkas (File Sharing) dan perangkat keras (Printer Sharing) dalam satu jaringan lokal.",
    "duration": "45 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-11-12/pertemuan-07/Materi-Pertemuan-7-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami metode berbagi folder dan file lokal",
        "Mengatur hak akses pembacaan dan penulisan berkas terbagi"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-11-12-p8",
    "classLevel": "11-12",
    "meeting": 8,
    "title": "Pemeriksaan dan Troubleshooting Jaringan Dasar",
    "category": "Jaringan Komputer",
    "description": "Menggunakan perkakas diagnostik jaringan seperti `ipconfig`, `ping`, `traceroute`, dan penanganan masalah jaringan fisik/logika.",
    "duration": "50 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-11-12/pertemuan-08/Materi-Pertemuan-8-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Mengenal perintah diagnostik `ipconfig` dan `traceroute`",
        "Mengidentifikasi isolasi masalah konektivitas terputus"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-11-12-p9",
    "classLevel": "11-12",
    "meeting": 9,
    "title": "Mengenal Internet dan Cara Kerja Akses Jaringan",
    "category": "Jaringan Komputer",
    "description": "Memahami infrastruktur ISP, cara kerja backbone internet, sistem domain DNS, dan pengantaran paket data antar benua.",
    "duration": "50 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-11-12/pertemuan-09/Materi-Pertemuan-9-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami peran ISP (Internet Service Provider)",
        "Menjelaskan pemetaan nama domain oleh DNS Server"
      ],
      "sections": [],
      "keyPoints": []
    }
  },
  {
    "id": "informatika-kelas-11-12-p10",
    "classLevel": "11-12",
    "meeting": 10,
    "title": "Pemanfaatan Cloud Storage & Kolaborasi Online",
    "category": "Teknologi Cloud",
    "description": "Pengenalan teknologi komputasi awan (Cloud Storage), enkripsi data awan, dan kolaborasi pengerjaan dokumen secara sinkron.",
    "duration": "45 menit",
    "locked": true,
    "document": {
      "available": false,
      "file": "assets/materials/kelas-11-12/pertemuan-10/Materi-Pertemuan-10-kelas-11-12.docx"
    },
    "content": {
      "objectives": [
        "Memahami konsep dasar Cloud Computing dan Cloud Storage",
        "Mengenal fitur kolaborasi dokumen bersama secara real-time"
      ],
      "sections": [],
      "keyPoints": []
    }
  }
];

/**
 * Loads materials dynamically from assets/data/materials.json with fallback to FALLBACK_MATERIALS
 * @returns {Promise<Array>} List of learning materials
 */
async function fetchMaterialsData() {
  try {
    const response = await fetch('./assets/data/materials.json');
    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return FALLBACK_MATERIALS;
  } catch (error) {
    console.warn('Gagal memuat materials.json via fetch (menggunakan data fallback):', error.message);
    return FALLBACK_MATERIALS;
  }
}

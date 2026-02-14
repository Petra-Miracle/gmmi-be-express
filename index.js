import express from "express";
import cors from "cors";
import helmet from "helmet";
// import fs from 'fs';
// import './config/env.js';

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.route.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import pengumumanRoutes from "./routes/pengumuman.routes.js";
import wartaRoutes from "./routes/warta.routes.js";
import ibadahRoutes from "./routes/ibadah.routes.js";
import arsipRoutes from "./routes/arsip.routes.js";
import keuanganRoutes from "./routes/keuangan.routes.js";
import programRoutes from "./routes/program.routes.js";
import pewartaanRoutes from "./routes/pewartaan.routes.js";
import renunganRoutes from "./routes/renungan.routes.js";
import carouselRoutes from "./routes/carousel.routes.js";
import jemaatRoutes from "./routes/jemaat.routes.js";
import pekerjaanRoutes from "./routes/pekerjaan.routes.js";
import sejarahRoutes from "./routes/sejarah.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Helmet adds secure HTTP headers
// app.use(helmet());
app.use(
  cors({
    origin: "*", // Allow all origins - adjust for production
  }),
);
app.use(express.json());

// // Note: Local file logging removed for Vercel compatibility
// app.use('/uploads', express.static('uploads'));

app.get("/ping", (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "GMMI Backend running" });
});

// app.use('/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/admins', adminRoutes); // Support plural
// app.use('/api/super-admin', adminRoutes); // Support super-admin prefix
// app.use('/api/announcements', pengumumanRoutes);
// app.use('/api/warta', wartaRoutes);
// app.use('/api/jadwal', ibadahRoutes);
// app.use('/api/arsip', arsipRoutes);
// app.use('/api/keuangan', keuanganRoutes);
// app.use('/api/programs', programRoutes);
// app.use('/api/pewartaan', pewartaanRoutes);
// app.use('/api/renungan', renunganRoutes);
// app.use('/api/carousel', carouselRoutes);
// app.use('/api/jemaat', jemaatRoutes);
// app.use('/api/pekerjaan', pekerjaanRoutes);
// app.use('/api/sejarah', sejarahRoutes);

// // Placeholder routes for frontend services
// app.use('/', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

package com.learnivo.competitionservice.config;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CompetitionRepository competitionRepository;

    public DataSeeder(CompetitionRepository competitionRepository) {
        this.competitionRepository = competitionRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Seeding ultra-realistic competitions...");

        // Ensure we clear out old dummy ones to keep it incredibly clean
        competitionRepository.deleteAll();

        List<Competition> comps = Arrays.asList(
                // ── CODING ───────────────────────────────────────────────────
                Competition.builder().title("Deep Learning & LLM Optimization").slug("dl-llm-opt").category("AI & ML").description("Fine-tuning Large Language Models for specific domain tasks.").image("/images/training-1.jpg").status(Competition.Status.ONGOING).prize("$15,000").maxParticipants(1500).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Quantize models to 4-bit; LoRA fine-tuning; Deploy vLLM.").build(),
                Competition.builder().title("Cybersecurity: Zero-Day Exploit Analysis").slug("cyber-zero-day").category("Cyber Research").description("Black-box vulnerability research on kernel modules.").image("/images/event-1.jpg").status(Competition.Status.ONGOING).prize("$50,000").maxParticipants(100).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Reverse engineer binary; Find buffer overflow; Write PoC exploit.").build(),

                // ── MATH ─────────────────────────────────────────────────────
                Competition.builder().title("Riemann Hypothesis Analytical Challenge").slug("riemann-math-hard").category("Pure Math").description("Deep analytical number theory and prime distribution.").image("/images/training-2.jpg").status(Competition.Status.ONGOING).prize("Fields Medal Nom.").maxParticipants(500).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Prove trivial zeros; π(x) asymptotic growth; LaTeX submission.").build(),
                Competition.builder().title("Post-Quantum Cryptography Algorithms").slug("math-pqc-hard").category("Applied Math").description("Design encryption resistant to Shor's algorithm.").image("/images/training-1.jpg").status(Competition.Status.ONGOING).prize("$20,000").maxParticipants(400).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Lattice-based systems; Error correction; NIST standard analysis.").build(),

                // ── ROBOTICS ─────────────────────────────────────────────────
                Competition.builder().title("Autonomous Drone Swarm Navigation").slug("drone-swarm-hard").category("Aero-Robotics").description("Program 5 drones to navigate obstacles using SLAM.").image("/images/training-3.jpg").status(Competition.Status.ONGOING).prize("$20,000").maxParticipants(300).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Decentralized SLAM; Flocking optimization; 4K video proof.").build(),
                Competition.builder().title("Humanoid Bipedal Locomotion Control").slug("robot-human-hard").category("Bio-Robotics").description("Implement dynamic balance for 22-DOF humanoids.").image("/images/training-1.jpg").status(Competition.Status.ONGOING).prize("$25,000").maxParticipants(200).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("ZMP calculation; Real-time gait smoothing; Push-recovery test.").build(),

                // ── PHYSICS ──────────────────────────────────────────────────
                Competition.builder().title("Quantum Computing Algorithm Design").slug("quantum-hard").category("Quantum").description("Design algorithms outperforming classical implementations.").image("/images/event-3.jpg").status(Competition.Status.ONGOING).prize("IBM System One Access").maxParticipants(200).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Gate depth optimization; Noise modeling; Qiskit submission.").build(),
                Competition.builder().title("Theoretical Astrophysics: BH Modeling").slug("physics-black-hole").category("Astrophysics").description("Model accretion disk dynamics around Schwarzschild black holes.").image("/images/training-2.jpg").status(Competition.Status.ONGOING).prize("NASA Collab").maxParticipants(150).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Relativistic MHD; Ray-tracing photons; CUDA simulation results.").build(),

                // ── SCIENCE ──────────────────────────────────────────────────
                Competition.builder().title("Biotech: CRISPR Base Editing").slug("biotech-crispr").category("Bio-Science").description("Design efficient gRNA for precision base editing.").image("/images/training-2.jpg").status(Competition.Status.ONGOING).prize("$30,000 Grant").maxParticipants(150).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("In-silico modeling; Off-target calculation; Protocol PDF.").build(),
                Competition.builder().title("Nanotech: Sustainable Carbon Capture").slug("sci-nanotech-hard").category("Materials").description("Design MOF structures for atmospheric carbon adsorption.").image("/images/event-1.jpg").status(Competition.Status.ONGOING).prize("$40,000").maxParticipants(250).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Molecular dynamics; Adsorption isotherms; Synthesis path.").build(),

                // ── ARTS ─────────────────────────────────────────────────────
                Competition.builder().title("Hyper-Realistic 3D Environment Design").slug("arts-3d-hard").category("Digital Arts").description("immersive 8K 3D environments using Unreal Engine 5.4.").image("/images/event-1.jpg").status(Competition.Status.ONGOING).prize("Wacom Cintiq Pro").maxParticipants(400).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Nanite & Lumen lighting; Custom vertex shaders; Source files.").build(),
                Competition.builder().title("Generative AI Art: Diffusion Finetuning").slug("arts-diffusion-hard").category("Generative Art").description("Train custom LoRA for specific aesthetic consistency.").image("/images/training-3.jpg").status(Competition.Status.ONGOING).prize("$10,000").maxParticipants(600).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Dataset curation; Prompt weighting; 50-image showcase.").build(),

                // ── LANGUAGE ─────────────────────────────────────────────────
                Competition.builder().title("Linguistic Forensic Analysis").slug("language-forensic-hard").category("Linguistics").description("Analyze anonymous communications to determine authorship.").image("/images/training-1.jpg").status(Competition.Status.ONGOING).prize("Oxford Fellowship").maxParticipants(600).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Idiolect mapping; Lexical density variation; Forensic report.").build(),
                Competition.builder().title("NLP: Low-Resource Translation Models").slug("lang-nlp-hard").category("NLP").description("Design NMT models for languages with <1M tokens.").image("/images/event-3.jpg").status(Competition.Status.ONGOING).prize("$15,000").maxParticipants(300).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Back-translation; Transliteration logic; BLEU score report.").build(),

                // ── MUSIC ────────────────────────────────────────────────────
                Competition.builder().title("Symphonic AI Composition").slug("music-ai-hard").category("AI Music").description("Compose 15-minute symphonic piece using AI counterpoint.").image("/images/training-3.jpg").status(Competition.Status.ONGOING).prize("Recording Session").maxParticipants(500).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Score XML/MIDI; High-quality mockup; AI Corpora report.").build(),
                Competition.builder().title("Advanced Subtractive Synthesis & Sound Design").slug("music-synth-hard").category("Sound Design").description("Create an original 10-track sample pack from scratch.").image("/images/event-1.jpg").status(Competition.Status.ONGOING).prize("Moog One Synth").maxParticipants(200).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("No presets; Wavetable & FM depth; High-pass layering.").build(),

                // ── SKILLS ───────────────────────────────────────────────────
                Competition.builder().title("GTM Strategy for Space-Tech Startup").slug("skills-space-gtm").category("Space Venture").description("Multi-million dollar GTM for lunar mineral extraction.").image("/images/event-1.jpg").status(Competition.Status.ONGOING).prize("$100,000 Inv.").maxParticipants(450).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Financial projections; Regulatory analysis; 15-slide deck.").build(),
                Competition.builder().title("Global Crisis Management & Leadership").slug("skills-crisis-hard").category("Strategic Leadership").description("Simulate leadership response to a global infrastructure outage.").image("/images/training-2.jpg").status(Competition.Status.ONGOING).prize("Executive Mentorship").maxParticipants(100).startDate("2026-01-01T00:00:00").deadline("2026-12-31T23:59:00").rules("Stakeholder comms; Resource allocation; Mitigation speed.").build()
        );

        competitionRepository.saveAll(comps);
        System.out.println("Seeded " + comps.size() + " category-matched HARD competitions successfully!");
    }
}

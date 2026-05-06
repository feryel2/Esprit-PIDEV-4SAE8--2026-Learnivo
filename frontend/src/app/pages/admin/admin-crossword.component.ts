import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, CrosswordPuzzleDto, CrosswordClueDto } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { LucideAngularModule, Grid, Plus, Trash2, Save, Type, Eye, Sparkles, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-admin-crossword',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="admin-container animate-page-in pb-20">
      <!-- Premium Header -->
      <header class="page-header">
        <div class="header-content">
          <div class="icon-orb">
             <lucide-icon [name]="Sparkles" [size]="24" class="text-white"></lucide-icon>
          </div>
          <div class="header-text">
            <h1>Crossword <span class="gradient-text">Studio</span></h1>
            <p>Concevez des défis intellectuels avec une précision chirurgicale.</p>
          </div>
        </div>
        <div class="header-actions">
           <button (click)="createNewPuzzle()" class="btn-primary">
              <lucide-icon [name]="Plus" [size]="18"></lucide-icon>
              <span>Nouveau Design</span>
           </button>
        </div>
      </header>

      <div class="workspace-grid">
        <!-- Dashboard / Sidebar -->
        <aside class="sidebar-panel">
          <div class="card glass">
            <div class="card-header">
              <lucide-icon [name]="Grid" [size]="18" class="text-indigo-400"></lucide-icon>
              <h2>Mes Créations</h2>
            </div>
            <div class="puzzle-list custom-scrollbar">
              <div *ngIf="puzzles.length === 0" class="empty-list">
                <p>Aucun projet actif</p>
              </div>
              <div *ngFor="let p of puzzles; let i = index" 
                   (click)="selectPuzzle(p)"
                   [class.active]="selectedPuzzle?.id === p.id"
                   class="puzzle-item animate-slide-in"
                   [style.animation-delay]="(i * 0.1) + 's'">
                <div class="puzzle-item-info">
                  <span class="p-title">{{ p.title }}</span>
                  <span class="p-meta">{{ p.gridSize }}x{{ p.gridSize }} • {{ p.clues.length }} mots</span>
                </div>
                <button (click)="deletePuzzle(p, $event)" class="btn-delete-mini">
                  <lucide-icon [name]="Trash2" [size]="14"></lucide-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions / Stats -->
          <div class="card glass mt-6 p-6 stats-card animate-fade-in">
             <div class="stat-row">
                <span class="stat-label">Total Puzzles</span>
                <span class="stat-value">{{ puzzles.length }}</span>
             </div>
             <div class="stat-progress">
                <div class="progress-bar" [style.width.%]="85"></div>
             </div>
          </div>
        </aside>

        <!-- Main Editor -->
        <main class="editor-panel">
          <div *ngIf="!selectedPuzzle" class="empty-state-canvas glass animate-float">
             <div class="canvas-icon">
                <lucide-icon [name]="Grid" [size]="64"></lucide-icon>
             </div>
             <h3>L'Atelier Créatif</h3>
             <p>Sélectionnez un projet ou commencez une nouvelle grille pour libérer votre imagination.</p>
          </div>

          <div *ngIf="selectedPuzzle" class="editor-content animate-zoom-in">
            <!-- Top Controls -->
            <div class="editor-toolbar glass mb-6">
               <div class="input-group">
                  <lucide-icon [name]="Type" [size]="16" class="opacity-50"></lucide-icon>
                  <input [(ngModel)]="selectedPuzzle.title" placeholder="Nommez votre chef-d'œuvre...">
               </div>
               <div class="divider"></div>
               <div class="size-control">
                  <span class="label">Grille: {{ selectedPuzzle.gridSize }}x{{ selectedPuzzle.gridSize }}</span>
                  <input type="range" min="5" max="15" [(ngModel)]="selectedPuzzle.gridSize" (change)="resizeGrid()">
               </div>
            </div>

            <div class="editor-main-layout">
              <!-- Grid Preview -->
              <section class="grid-section">
                <div class="grid-canvas glass shadow-2xl">
                  <div class="grid-numbers-top">
                    <span *ngFor="let i of [].constructor(selectedPuzzle.gridSize); let idx = index">{{ idx + 1 }}</span>
                  </div>
                  <div class="grid-container-wrapper">
                    <div class="grid-numbers-left">
                      <span *ngFor="let i of [].constructor(selectedPuzzle.gridSize); let idx = index">{{ idx + 1 }}</span>
                    </div>
                   <div class="visual-grid" [style.grid-template-columns]="'repeat(' + selectedPuzzle.gridSize + ', 1fr)'">
                      <div *ngFor="let cell of visualGrid" 
                           (click)="onGridCellClick(cell)"
                           class="cell-admin"
                           [class.is-black]="cell.isBlack"
                           [class.is-highlighted]="isCellHighlighted(cell)"
                           [class.is-active-target]="activeClueIndex !== null && cell.x === activeClue?.x && cell.y === activeClue?.y">
                         <span class="letter animate-pop" *ngIf="!cell.isBlack">{{ cell.char }}</span>
                         <span class="number" *ngIf="cell.label">{{ cell.label }}</span>
                         <div class="placement-overlay" *ngIf="activeClueIndex !== null && !cell.isBlack"></div>
                      </div>
                   </div>
                  </div>
                </div>
                <div class="grid-legend mt-4 glass px-4 py-2">
                   <div class="legend-item"><span class="dot active"></span> <span>Occupé</span></div>
                   <div class="legend-item"><span class="dot empty"></span> <span>Vide</span></div>
                   <div class="legend-item"><span class="dot highlight"></span> <span>Édition</span></div>
                </div>
              </section>

              <!-- Clues Manager -->
              <section class="clues-section">
                <div class="card glass flex flex-col h-full overflow-hidden">
                  <div class="card-header border-b border-indigo-100/10 mb-0 py-4 px-6 flex justify-between items-center">
                    <h3 class="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                       Lexique des Indices
                    </h3>
                    <button (click)="addClue()" class="btn-icon-plus shadow-glow">
                       <lucide-icon [name]="Plus" [size]="20"></lucide-icon>
                    </button>
                  </div>
                  
                  <div class="clue-list-editor custom-scrollbar p-6 space-y-4">
                    <div *ngFor="let clue of selectedPuzzle.clues; let i = index" 
                         (mouseenter)="highlightedClueIndex = i"
                         (mouseleave)="highlightedClueIndex = null"
                         (click)="activeClueIndex = i"
                         [class.active-clue-card]="activeClueIndex === i"
                         class="clue-card animate-slide-in-right"
                         [style.animation-delay]="(i * 0.05) + 's'">
                      
                      <div class="clue-card-header">
                        <div class="clue-tag">#{{ clue.number }}</div>
                        <select [(ngModel)]="clue.direction" (change)="onClueChange()" class="mini-select">
                          <option value="across">Horizontal</option>
                          <option value="down">Vertical</option>
                        </select>
                        <button (click)="removeClue(i)" class="btn-delete-x">
                          <lucide-icon [name]="Trash2" [size]="14"></lucide-icon>
                        </button>
                      </div>
                      
                      <div class="clue-inputs">
                        <input [(ngModel)]="clue.answer" (input)="onClueChange()" placeholder="RÉPONSE" class="input-answer">
                        <textarea [(ngModel)]="clue.clue" rows="1" placeholder="L'indice mystérieux..." class="input-clue"></textarea>
                      </div>
                      
                      <div class="clue-coords">
                         <div class="coord"><span class="label">X</span> <span class="val">{{ clue.x }}</span></div>
                         <div class="coord"><span class="label">Y</span> <span class="val">{{ clue.y }}</span></div>
                         <div class="coord-info" *ngIf="activeClueIndex === i">
                            Cliquez sur la grille pour placer
                         </div>
                      </div>
                    </div>
                  </div>

                  <div class="card-footer p-6 border-t border-indigo-100/10">
                    <button (click)="savePuzzle()" class="btn-save-full shadow-indigo">
                      <lucide-icon [name]="Save" [size]="20"></lucide-icon>
                      <span>SAUVEGARDER LE PROJET</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Design Tokens & Animations */
    @keyframes pageIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pop {
      0% { transform: scale(0); }
      80% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .animate-page-in { animation: pageIn 0.8s ease-out forwards; }
    .animate-slide-in { animation: slideIn 0.5s ease-out forwards; }
    .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
    .animate-zoom-in { animation: zoomIn 0.4s ease-out forwards; }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-float { animation: float 4s ease-in-out infinite; }

    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'Outfit', 'Inter', sans-serif;
      color: #1e293b;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;
    }
    .header-content { display: flex; align-items: center; gap: 20px; }
    .icon-orb {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    }
    .header-text h1 { font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px; }
    .gradient-text { background: linear-gradient(90deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header-text p { margin: 4px 0 0 0; opacity: 0.5; font-size: 14px; font-weight: 500; }

    .btn-primary {
      background: #1e293b;
      color: white;
      padding: 12px 24px;
      border-radius: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }
    .btn-primary:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

    /* Layout */
    .workspace-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 40px;
    }

    /* Glass Effect Components */
    .glass {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    }

    .sidebar-panel { position: sticky; top: 40px; height: fit-content; }
    .card-header { padding: 24px; display: flex; align-items: center; gap: 12px; }
    .card-header h2 { font-size: 16px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 1px; }

    .puzzle-list { max-height: 480px; overflow-y: auto; padding: 0 12px 24px 12px; }
    .puzzle-item {
      padding: 16px;
      border-radius: 20px;
      margin-bottom: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.5);
    }
    .puzzle-item:hover { background: white; border-color: #e2e8f0; transform: scale(1.02); }
    .puzzle-item.active { background: white; border-color: #6366f1; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.05); }
    .puzzle-item-info { display: flex; flex-direction: column; min-width: 0; }
    .p-title { font-weight: 800; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .p-meta { font-size: 11px; opacity: 0.5; font-weight: 600; margin-top: 2px; }

    .btn-delete-mini {
      width: 32px; height: 32px; border-radius: 10px; border: none; background: rgba(244, 63, 94, 0.05);
      color: #f43f5e; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
    }
    .btn-delete-mini:hover { background: #f43f5e; color: white; }

    /* Stats Card */
    .stat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .stat-label { font-size: 13px; font-weight: 700; opacity: 0.6; }
    .stat-value { font-size: 20px; font-weight: 900; color: #6366f1; }
    .stat-progress { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 3px; }

    /* Main Editor Panels */
    .empty-state-canvas {
      height: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px;
    }
    .canvas-icon { color: #6366f1; margin-bottom: 24px; opacity: 0.5; }
    .empty-state-canvas h3 { font-size: 24px; font-weight: 900; margin: 0 0 12px 0; }
    .empty-state-canvas p { font-size: 15px; opacity: 0.5; max-width: 400px; line-height: 1.6; }

    .editor-toolbar { padding: 12px 24px; display: flex; align-items: center; gap: 20px; }
    .editor-toolbar .input-group { flex: 1; display: flex; align-items: center; gap: 12px; }
    .editor-toolbar input { border: none; background: transparent; font-size: 18px; font-weight: 800; outline: none; width: 100%; }
    .divider { width: 1px; height: 32px; background: #e2e8f0; }
    .size-control { display: flex; align-items: center; gap: 15px; }
    .size-control .label { font-size: 12px; font-weight: 800; text-transform: uppercase; white-space: nowrap; }

    .editor-main-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; height: 700px; }

    /* Grid Section */
    .grid-section { display: flex; flex-direction: column; }
    .grid-canvas { 
      background: white; border-radius: 24px; padding: 30px; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .grid-numbers-top { display: flex; gap: 0; margin-bottom: 4px; padding-left: 20px; }
    .grid-numbers-top span { width: 34px; text-align: center; font-size: 8px; font-weight: 900; opacity: 0.3; }
    .grid-container-wrapper { display: flex; gap: 4px; }
    .grid-numbers-left { display: flex; flex-direction: column; gap: 0; }
    .grid-numbers-left span { height: 34px; display: flex; align-items: center; font-size: 8px; font-weight: 900; opacity: 0.3; }

    .visual-grid { display: grid; gap: 1px; background: #cbd5e1; border: 4px solid #0f172a; border-radius: 4px; }
    .cell-admin {
      width: 34px; height: 34px; background: white; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;
    }
    .cell-admin.is-black { background: #0f172a; }
    .cell-admin.is-highlighted { background: #e0e7ff; box-shadow: inset 0 0 0 2px #6366f1; z-index: 10; }
    .cell-admin.is-active-target { background: #dcfce7; box-shadow: inset 0 0 0 2px #22c55e; }

    .placement-overlay {
      position: absolute;
      inset: 0;
      background: rgba(99, 102, 241, 0.1);
      border: 1px dashed #6366f1;
      pointer-events: none;
      display: none;
    }
    .cell-admin:hover .placement-overlay { display: block; }

    .cell-admin .letter { font-weight: 850; font-size: 18px; color: #0f172a; text-transform: uppercase; }
    .cell-admin .number { position: absolute; top: 1px; left: 2px; font-size: 7px; font-weight: 900; color: #94a3b8; }

    .grid-legend { display: flex; gap: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.active { background: #0f172a; }
    .dot.empty { background: white; border: 1px solid #cbd5e1; }
    .dot.highlight { background: #6366f1; }

    /* Clues Section */
    .clues-section { height: 100%; }
    .clue-list-editor { flex: 1; overflow-y: auto; }
    .btn-icon-plus { 
      width: 40px; height: 40px; background: #6366f1; color: white; border-radius: 14px; border: none; cursor: pointer; transition: all 0.3s;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-icon-plus:hover { transform: rotate(90deg) scale(1.1); background: #4f46e5; }
    .shadow-glow { box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }

    .clue-card {
      background: white; border-radius: 20px; padding: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      transition: all 0.3s;
    }
    .clue-card:hover { border-color: #6366f1; transform: translateX(-5px); }
    .clue-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .clue-tag { background: #f1f5f9; padding: 4px 12px; border-radius: 8px; font-size: 10px; font-weight: 900; color: #64748b; }
    .mini-select { border: none; background: transparent; font-size: 11px; font-weight: 800; color: #6366f1; outline: none; cursor: pointer; }
    .btn-delete-x { background: transparent; border: none; color: #f43f5e; opacity: 0.3; cursor: pointer; transition: opacity 0.2s; }
    .btn-delete-x:hover { opacity: 1; }

    .clue-inputs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .input-answer { border: none; background: #f8fafc; padding: 8px 12px; border-radius: 12px; font-size: 13px; font-weight: 900; text-transform: uppercase; outline: none; transition: background 0.2s; }
    .input-answer:focus { background: #f1f5f9; box-shadow: 0 0 0 2px #e2e8f0; }
    .input-clue { border: none; background: transparent; padding: 4px 0; font-size: 12px; font-weight: 500; opacity: 0.7; outline: none; resize: none; }

    .clue-coords { display: flex; align-items: center; gap: 15px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
    .coord { display: flex; align-items: center; gap: 6px; }
    .coord .label { font-size: 10px; font-weight: 900; opacity: 0.3; }
    .coord .val { font-size: 12px; font-weight: 800; color: #6366f1; }
    .coord-info { margin-left: auto; font-size: 9px; font-weight: 700; color: #22c55e; text-transform: uppercase; }

    .active-clue-card { border-color: #6366f1 !important; background: rgba(99, 102, 241, 0.05) !important; }

    .btn-save-full {
      width: 100%; padding: 18px; background: #6366f1; color: white; border-radius: 20px; font-weight: 800; border: none;
      display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.3s;
      letter-spacing: 1px;
    }
    .btn-save-full:hover { background: #4f46e5; transform: translateY(-2px); }
    .shadow-indigo { box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3); }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
  `]
})
export class AdminCrosswordComponent implements OnInit {
  private dataService = inject(DataService);
  private notify = inject(NotificationService);

  readonly Grid = Grid;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly Type = Type;
  readonly Eye = Eye;
  readonly Sparkles = Sparkles;
  readonly ChevronRight = ChevronRight;

  puzzles: CrosswordPuzzleDto[] = [];
  selectedPuzzle: CrosswordPuzzleDto | null = null;
  visualGrid: { x: number, y: number, isBlack: boolean, char: string, label?: number }[] = [];
  highlightedClueIndex: number | null = null;
  activeClueIndex: number | null = null;

  get activeClue(): CrosswordClueDto | null {
    if (this.activeClueIndex === null || !this.selectedPuzzle) return null;
    return this.selectedPuzzle.clues[this.activeClueIndex];
  }

  ngOnInit() {
    this.loadPuzzles();
  }

  loadPuzzles() {
    this.dataService.getAllCrosswordPuzzles().subscribe({
      next: (list) => {
        this.puzzles = list;
      },
      error: () => this.notify.error('Erreur de chargement')
    });
  }

  selectPuzzle(p: CrosswordPuzzleDto) {
    this.selectedPuzzle = JSON.parse(JSON.stringify(p)); // Deep copy for editing
    this.buildVisualGrid();
  }

  createNewPuzzle() {
    this.selectedPuzzle = {
      id: null as any,
      title: "Nouveau Projet",
      gridSize: 10,
      clues: []
    };
    this.buildVisualGrid();
  }

  resizeGrid() {
    this.buildVisualGrid();
  }

  buildVisualGrid() {
    if (!this.selectedPuzzle) return;
    const size = this.selectedPuzzle.gridSize;
    this.visualGrid = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const clueChar = this.getCharFromClues(x, y);
        const label = this.getLabelForCell(x, y);
        this.visualGrid.push({
          x, y, 
          isBlack: clueChar === null,
          char: clueChar || '',
          label: label || undefined
        });
      }
    }
  }

  getLabelForCell(x: number, y: number): number | null {
    if (!this.selectedPuzzle) return null;
    const clue = this.selectedPuzzle.clues.find(c => c.x === x && c.y === y);
    return clue ? clue.number : null;
  }

  getCharFromClues(x: number, y: number): string | null {
    if (!this.selectedPuzzle) return null;
    for (const clue of this.selectedPuzzle.clues) {
      if (!clue.answer) continue;
      if (clue.direction === 'across') {
        if (clue.y === y && x >= clue.x && x < clue.x + clue.answer.length) {
          return clue.answer[x - clue.x];
        }
      } else {
        if (clue.x === x && y >= clue.y && y < clue.y + clue.answer.length) {
          return clue.answer[y - clue.y];
        }
      }
    }
    return null;
  }

  onGridCellClick(cell: any) {
    if (this.activeClueIndex !== null && this.selectedPuzzle) {
        const clue = this.selectedPuzzle.clues[this.activeClueIndex];
        clue.x = cell.x;
        clue.y = cell.y;
        this.onClueChange();
    } else {
        // Fallback: toggle black cell if no clue is selected
        this.toggleCell(cell);
    }
  }

  toggleCell(cell: any) {
    if (!this.selectedPuzzle) return;
    // Logic to toggle black/empty grid (requires a separate representation beyond clues)
    // For now, let's allow "placing" to define the structure
  }

  addClue() {
    if (!this.selectedPuzzle) return;
    // Auto-numbering
    const maxNum = this.selectedPuzzle.clues.reduce((max, c) => Math.max(max, c.number), 0);
    this.selectedPuzzle.clues.push({
      number: maxNum + 1,
      direction: 'across',
      clue: '',
      answer: '',
      x: 0,
      y: 0
    });
    this.onClueChange();
  }

  removeClue(index: number) {
    this.selectedPuzzle?.clues.splice(index, 1);
    this.onClueChange();
  }

  onClueChange() {
    this.buildVisualGrid();
  }

  isCellHighlighted(cell: any): boolean {
    if (this.highlightedClueIndex === null || !this.selectedPuzzle) return false;
    const clue = this.selectedPuzzle.clues[this.highlightedClueIndex];
    if (!clue.answer) return false;
    if (clue.direction === 'across') {
      return cell.y === clue.y && cell.x >= clue.x && cell.x < clue.x + clue.answer.length;
    } else {
      return cell.x === clue.x && cell.y >= clue.y && cell.y < clue.y + clue.answer.length;
    }
  }

  savePuzzle() {
    if (!this.selectedPuzzle) return;
    this.dataService.saveCrosswordPuzzle(this.selectedPuzzle).subscribe({
      next: (saved) => {
        this.notify.success("Puzzle enregistré avec succès !");
        this.loadPuzzles();
        this.selectedPuzzle = saved; // Update with real ID if it was 0
      },
      error: () => this.notify.error("Échec de l'enregistrement")
    });
  }

  deletePuzzle(p: CrosswordPuzzleDto, event: MouseEvent) {
    event.stopPropagation();
    if (!confirm(`Voulez-vous vraiment supprimer le puzzle "${p.title}" ?`)) return;
    
    this.dataService.deleteCrosswordPuzzle(p.id).subscribe({
      next: () => {
        this.notify.success("Puzzle supprimé.");
        if (this.selectedPuzzle?.id === p.id) this.selectedPuzzle = null;
        this.loadPuzzles();
      },
      error: () => this.notify.error("Erreur lors de la suppression")
    });
  }
}

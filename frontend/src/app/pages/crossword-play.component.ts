import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, CrosswordClueDto } from '../services/data.service';

interface CrosswordCell {
  x: number;
  y: number;
  char: string;
  userInput: string;
  isBlack: boolean;
  number?: number;
  isCorrect?: boolean;
}

interface Clue extends CrosswordClueDto {
  direction: 'across' | 'down';
}

@Component({
  selector: 'app-crossword-play',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="crossword-page">
      <div class="game-header">
        <a routerLink="/" class="back-link">
          <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          RETOUR
        </a>
        <div class="title-group">
          <h1>Mots <span class="highlight">Croisés</span></h1>
          <p>Thème: {{ puzzleTitle }}</p>
        </div>
        <div class="game-actions">
          <button (click)="checkAnswers()" class="btn-check">Vérifier</button>
          <button (click)="resetGame()" class="btn-reset">Reset</button>
        </div>
      </div>

      <div class="game-container">
        <div class="clues-panel left">
          <h2>Horizontal</h2>
          <div class="clue-list">
            <div *ngFor="let clue of acrossClues" 
                 class="clue-item" 
                 [class.active]="activeClue === clue"
                 (click)="selectClue(clue)">
              <span class="clue-num">{{ clue.number }}.</span>
              <span class="clue-text">{{ clue.clue }}</span>
            </div>
          </div>
        </div>

        <div class="grid-container">
          <div class="crossword-grid" [style.grid-template-columns]="'repeat(' + gridSize + ', 1fr)'">
            <div *ngFor="let cell of grid; let i = index" 
                 class="grid-cell" 
                 [class.black]="cell.isBlack"
                 [class.selected]="isSelected(cell)"
                 [class.highlighted]="isHighlighted(cell)"
                 [class.correct]="cell.isCorrect === true"
                 [class.incorrect]="cell.isCorrect === false"
                 (click)="onCellClick(cell)">
              <span class="cell-num" *ngIf="cell.number">{{ cell.number }}</span>
              <input *ngIf="!cell.isBlack" 
                     type="text" 
                     maxlength="1" 
                     [(ngModel)]="cell.userInput" 
                     (keyup)="onKeyUp($event, cell)"
                     (focus)="onCellFocus(cell)"
                     [id]="'cell-' + cell.x + '-' + cell.y">
            </div>
          </div>
        </div>

        <div class="clues-panel right">
          <h2>Vertical</h2>
          <div class="clue-list">
            <div *ngFor="let clue of downClues" 
                 class="clue-item" 
                 [class.active]="activeClue === clue"
                 (click)="selectClue(clue)">
              <span class="clue-num">{{ clue.number }}.</span>
              <span class="clue-text">{{ clue.clue }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-clue" *ngIf="activeClue">
        <span class="active-num">{{ activeClue.number }} {{ activeClue.direction === 'across' ? 'horiz' : 'vert' }}:</span>
        {{ activeClue.clue }}
      </div>
    </div>
  `,
  styles: [`
    .crossword-page {
      min-height: 100vh;
      background-color: #1a1625;
      color: white;
      font-family: 'Inter', sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .game-header {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .back-link:hover {
      color: #d2f500;
    }

    .title-group h1 {
      font-size: 24px;
      margin: 0;
      font-weight: 950;
      text-transform: uppercase;
    }

    .highlight { color: #d2f500; }

    .title-group p {
      font-size: 12px;
      margin: 4px 0 0 0;
      opacity: 0.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .game-actions {
      display: flex;
      gap: 12px;
    }

    .btn-check {
      background: #d2f500;
      color: #0f172a;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 12px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-reset {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 12px;
      cursor: pointer;
    }

    .btn-check:hover { transform: scale(1.05); }

    .game-container {
      display: flex;
      gap: 30px;
      width: 100%;
      max-width: 1200px;
      justify-content: center;
    }

    .clues-panel {
      width: 250px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 16px;
      padding: 20px;
      max-height: 600px;
      overflow-y: auto;
    }

    .clues-panel h2 {
      font-size: 14px;
      text-transform: uppercase;
      color: #d2f500;
      margin-top: 0;
      border-bottom: 2px solid rgba(210, 245, 0, 0.2);
      padding-bottom: 10px;
    }

    .clue-item {
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 4px;
      transition: background 0.2s;
    }

    .clue-item:hover { background: rgba(255, 255, 255, 0.05); }
    .clue-item.active { background: #312e81; border-left: 3px solid #d2f500; }

    .clue-num { font-weight: 800; margin-right: 8px; color: #d2f500; }

    .grid-container {
      background: #0f172a;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }

    .crossword-grid {
      display: grid;
      gap: 2px;
      background: #334155;
      border: 2px solid #334155;
    }

    .grid-cell {
      aspect-ratio: 1/1;
      width: 45px;
      background: white;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .grid-cell.black { background: #0f172a; }

    .grid-cell.selected { background: #d2f500 !important; }
    .grid-cell.selected input { color: #0f172a; font-weight: 900; }

    .grid-cell.highlighted { background: #e2f5ff; }
    .grid-cell.highlighted input { color: #0f172a; }

    .grid-cell.correct { background: #dcfce7 !important; }
    .grid-cell.correct input { color: #166534; font-weight: 800; }

    .grid-cell.incorrect { background: #fee2e2 !important; }
    .grid-cell.incorrect input { color: #991b1b; }

    .cell-num {
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 9px;
      color: #64748b;
      font-weight: 700;
      pointer-events: none;
    }

    .grid-cell input {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      text-transform: uppercase;
      outline: none;
      color: #0f172a;
    }

    .mobile-clue {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #312e81;
      padding: 15px 25px;
      border-radius: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      border: 1px solid #d2f500;
      z-index: 100;
      font-size: 14px;
      max-width: 90%;
    }

    .active-num { font-weight: 900; color: #d2f500; margin-right: 10px; }

    @media (max-width: 900px) {
      .clues-panel { display: none; }
      .grid-cell { width: 35px; }
    }
  `]
})
export class CrosswordPlayComponent implements OnInit {
  private dataService = inject(DataService);

  gridSize = 10;
  grid: CrosswordCell[] = [];
  acrossClues: Clue[] = [];
  downClues: Clue[] = [];
  activeClue: Clue | null = null;
  selectedCell: CrosswordCell | null = null;
  puzzleTitle = "Chargement...";

  ngOnInit() {
    this.fetchPuzzle();
  }

  fetchPuzzle() {
    this.dataService.getCrosswordPuzzle().subscribe({
      next: (puzzle) => {
        this.gridSize = puzzle.gridSize;
        this.puzzleTitle = puzzle.title;
        this.initGrid();
        this.loadPuzzle(puzzle.clues);
      },
      error: (err) => {
        console.error("Failed to load puzzle", err);
        this.puzzleTitle = "Erreur de chargement";
      }
    });
  }

  initGrid() {
// ... (keep this one)
    this.grid = [];
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.grid.push({
          x, y, char: '', userInput: '', isBlack: true
        });
      }
    }
  }

  loadPuzzle(clues: CrosswordClueDto[]) {
    this.acrossClues = [];
    this.downClues = [];

    clues.forEach(c => {
      const clue = c as Clue;
      if (clue.direction === 'across') {
        this.acrossClues.push(clue);
      } else {
        this.downClues.push(clue);
      }
      this.markCells(clue);
    });

    // Sort clues
    this.acrossClues.sort((a, b) => a.number - b.number);
    this.downClues.sort((a, b) => a.number - b.number);
  }

  markCells(clue: Clue) {
    for (let i = 0; i < clue.answer.length; i++) {
      const x = clue.direction === 'across' ? clue.x + i : clue.x;
      const y = clue.direction === 'across' ? clue.y : clue.y + i;
      
      const cell = this.getCell(x, y);
      if (cell) {
        cell.isBlack = false;
        cell.char = clue.answer[i];
        if (i === 0) cell.number = clue.number;
      }
    }
  }

  getCell(x: number, y: number): CrosswordCell | undefined {
    return this.grid.find(c => c.x === x && c.y === y);
  }

  onCellClick(cell: CrosswordCell) {
    if (cell.isBlack) return;
    this.selectedCell = cell;
    
    // Find clues involving this cell
    const clues = [...this.acrossClues, ...this.downClues].filter(c => {
      if (c.direction === 'across') {
        return c.y === cell.y && cell.x >= c.x && cell.x < c.x + c.answer.length;
      } else {
        return c.x === cell.x && cell.y >= c.y && cell.y < c.y + c.answer.length;
      }
    });

    if (clues.length > 0) {
      if (this.activeClue && clues.includes(this.activeClue)) {
        // Toggle direction if already selected
        const other = clues.find(cl => cl !== this.activeClue);
        if (other) this.activeClue = other;
      } else {
        this.activeClue = clues[0];
      }
    }
  }

  onCellFocus(cell: CrosswordCell) {
    this.onCellClick(cell);
  }

  selectClue(clue: Clue) {
    this.activeClue = clue;
    this.selectedCell = this.getCell(clue.x, clue.y) || null;
    const id = `cell-${clue.x}-${clue.y}`;
    document.getElementById(id)?.focus();
  }

  isSelected(cell: CrosswordCell): boolean {
    return this.selectedCell?.x === cell.x && this.selectedCell?.y === cell.y;
  }

  isHighlighted(cell: CrosswordCell): boolean {
    if (!this.activeClue) return false;
    const c = this.activeClue;
    if (c.direction === 'across') {
      return cell.y === c.y && cell.x >= c.x && cell.x < c.x + c.answer.length;
    } else {
      return cell.x === c.x && cell.y >= c.y && cell.y < c.y + c.answer.length;
    }
  }

  onKeyUp(event: KeyboardEvent, cell: CrosswordCell) {
    if (event.key === 'Backspace') {
      if (cell.userInput === '') {
        this.moveFocus(-1);
      }
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      cell.userInput = event.key.toUpperCase();
      this.moveFocus(1);
    }
    
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        // Handle arrows if needed
    }
  }

  moveFocus(dir: number) {
    if (!this.activeClue || !this.selectedCell) return;
    
    let nextX = this.selectedCell.x;
    let nextY = this.selectedCell.y;

    if (this.activeClue.direction === 'across') {
      nextX += dir;
    } else {
      nextY += dir;
    }

    const nextCell = this.getCell(nextX, nextY);
    if (nextCell && !nextCell.isBlack) {
      this.selectedCell = nextCell;
      document.getElementById(`cell-${nextX}-${nextY}`)?.focus();
    }
  }

  checkAnswers() {
    this.grid.forEach(cell => {
      if (!cell.isBlack) {
        cell.isCorrect = cell.userInput.toUpperCase() === cell.char.toUpperCase();
      }
    });
  }

  resetGame() {
    this.grid.forEach(cell => {
      cell.userInput = '';
      cell.isCorrect = undefined;
    });
    this.selectedCell = null;
    this.activeClue = null;
  }
}

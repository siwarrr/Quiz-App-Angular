export interface Question {
  _id?: string;  // Le champ _id est optionnel ici
  question: string;
  type: 'true/false' | 'single choice' | 'multiple choice' | 'short answer';
  options?: { value: string, label: string }[];  // Liste des options de réponse
  correctAnswer: string | string[];  // Peut être une chaîne ou un tableau de chaînes
}

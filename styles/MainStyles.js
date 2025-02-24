import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const Header = styled.h1`
  text-align: center;
`;

export const SliderContainer = styled.div`
  margin: 20px 0;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

export const Slider = styled.input`
  width: 100%;
`;

export const Controls = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Status = styled.div`
  text-align: center;
  margin-top: 10px;
  color: ${(props) => (props.error ? 'red' : 'green')};
`;

export const ControlGroup = styled.div`
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

export const CombinedSliderContainer = styled.div`
  margin: 20px 0;
`;

export const CombinedSliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

// Styles pour le bouton (si nécessaire)
export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// Styles pour les messages d'erreur ou de succès
export const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
  background-color: ${props => props.error ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.error ? '#c62828' : '#2e7d32'};
`;

// Styles pour le conteneur flexible
export const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'center'};
`;

// Styles pour une grille responsive
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

// Styles pour un panneau
export const Panel = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Styles pour le loader
export const Loader = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const StepIndicator = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 1.2em;
`;

export const ButtonGroup = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 1.2em;
`;




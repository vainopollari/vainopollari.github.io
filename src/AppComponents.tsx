import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import './App.css'

const NAME_OR_MARK = "Nimi tai nimimerkki*";
const SONG = "Biisi*"
const FACEPICTURE = "Kasvokuva"
const PERMISSION_TEXT = "Sallin tietojeni tallennuksen karaokejärjestelmään";

interface LabelProps {
    text: string;
}

const FormLabel: React.FC<LabelProps> = props => {
    return (
        <label>{props.text}</label>
    )
}

const Loader: React.FC = () => {
    return <span className="loader"></span>;
  };

export const NameForm: React.FC = () => {
    const [songName, setSongName] = useState<string>("")
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined | null>();
    const [showLoader, setShowLoader] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        setFile(selectedFile);
    };
    
    const handleButtonClick = useCallback(() => {
        setShowLoader(true);

        setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        setSongName("")
    }, [])

    const handleKeySelection = useCallback((value: string) => {
        setSelectedKey((prev) => (prev === value ? null : value));
      }, []);

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSongName("");
    };

    const getButtonClassName = (value: string) => {
        return `selection-button ${selectedKey === value ? 'selected' : ''}`;
    };
    
    return (
        <form onSubmit={handleFormSubmit} className="karaoke-form">
            <FormLabel text={NAME_OR_MARK} />
            <input
                type="text"
                id="personName"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                className="karaoke-form-name-input"
            />

            <FormLabel text={FACEPICTURE} />
            <button onClick={() => fileRef.current?.click()} className="facepicture">
                <input
                id="upload"
                name="upload"
                type="file"
                ref={fileRef}
                hidden
                onChange={handleChange}
                />
                +Tuo kasvokuva
            </button>

            <FormLabel text={SONG} />
            <select defaultValue={"DEFAULT"} className="karaoke-form-dropdown">
                <option value="DEFAULT" disabled>Valitse alta</option>
                <option value="Pate">Mä elän vieläkin</option>
                <option value="Paula">Aikuinen nainen</option>
                <option value="Vesku">Tuomittuna kulkemaan</option>
            </select>

            <FormLabel text="Sävellaji*" />
            <div className="selection-buttons">
                <input 
                    type="button" 
                    value="-2" 
                    className={getButtonClassName("-2")}
                    onClick={() => handleKeySelection("-2")}
                />
                <input 
                    type="button" 
                    value="-1"
                    className={getButtonClassName("-1")}
                    onClick={() => handleKeySelection("-1")}
                />
                <input 
                    type="button" 
                    value="0" 
                    className={getButtonClassName("0")}
                    onClick={() => handleKeySelection("0")}
                />
                <input 
                    type="button" 
                    value="+1" 
                    className={getButtonClassName("+1")}
                    onClick={() => handleKeySelection("+1")}
                />
                <input 
                    type="button" 
                    value="+2" 
                    className={getButtonClassName("+2")}
                    onClick={() => handleKeySelection("+2")}
                />
            </div>

            <div className="form-checkbox">
                <input type="checkbox" id="save_permission" name="permission" />
                <label htmlFor="save_permission">{PERMISSION_TEXT}</label>
            </div>

                <button onClick={handleButtonClick} className="form-submit-button">
                    {showLoader ? <Loader /> : "Ilmoittaudu"}
                </button>
        </form>
    )
}

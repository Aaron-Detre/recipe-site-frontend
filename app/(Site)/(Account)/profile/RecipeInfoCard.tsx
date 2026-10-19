import { Image } from "react-bootstrap";
import "./infoCardStyles.css";

export default function RecipeInfoCard({
  title,
  img,
  vertical,
}: {
  title: string;
  img?: string;
  vertical?: boolean;
}) {
  return (
    <div className={`wdf-info-card ${vertical && "wdf-vertical"}`}>
      <Image
        src={img ?? "/images/plate.svg"}
        className="wdf-info-card-image-thumbnail-small"
      />
      <div className="wdf-info-card-body wdf-info-card-body-header wdf-text-decoration-none">
        <span>{title}</span>
      </div>
    </div>
  );
}

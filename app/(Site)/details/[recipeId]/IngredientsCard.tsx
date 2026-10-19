"use client";
import {
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormGroup,
  FormLabel,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import {
  Ingredient,
  ScalableIngredient,
} from "../../UtilClasses/Types";
import type { ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import FlexGap from "../../UtilClasses/FlexGap";

export default function IngredientsCard({
  ingredients,
  scalable,
}: {
  ingredients: Ingredient[] | ScalableIngredient[];
  scalable: boolean;
}) {
  const addId = (
    ingredient: Ingredient | ScalableIngredient,
  ): Ingredient | ScalableIngredient => {
    return { ...ingredient, id: uuidv4() };
  };
  const ingredientsWithIds = ingredients.map(addId);
  const [scale, setScale] = useState(1);
  const scaleChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setScale(Number(e.target.value));
  const scaleIngredient = (amount: number) => {
    const scaledNum = amount * scale;
    let scaledStr = scaledNum.toString();
    if (scaledStr.includes(".")) scaledStr = scaledNum.toFixed(2);
    return scaledStr;
  };

  return (
    <Card className="wdf-details-ingredients shadow">
      <CardHeader className="d-flex align-items-baseline">
        Ingredients
        <FlexGap />
        {scalable && (
          <FormGroup
            controlId="wdf-ingredients-scale"
            className="d-flex align-items-baseline gap-2 ms-4"
          >
            <FormLabel>Scale</FormLabel>
            <FormControl type="number" value={scale} onChange={scaleChanges} />
          </FormGroup>
        )}
      </CardHeader>
      <CardBody>
        <ListGroup className="wdf-details-ingredients-list">
          {ingredients.length > 0 ? (
            ingredientsWithIds.map((ingredient) =>
              scalable ? (
                <ListGroupItem key={ingredient.id}>
                  <span>{ingredient.ingredient}</span>
                  {"amount" in ingredient &&
                    (ingredient.unit || ingredient.amount) && (
                      <span>{` - ${scaleIngredient(ingredient.amount)} ${
                        ingredient.unit
                      }`}</span>
                    )}
                </ListGroupItem>
              ) : (
                <ListGroupItem key={ingredient.id}>
                  <span>{ingredient.ingredient}</span>
                  {"measure" in ingredient && ingredient.measure && (
                    <span>{" - " + ingredient.measure}</span>
                  )}
                </ListGroupItem>
              ),
            )
          ) : (
            <span>No ingredients...</span>
          )}
        </ListGroup>
      </CardBody>
    </Card>
  );
}

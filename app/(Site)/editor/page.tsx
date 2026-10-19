"use client";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import {
  Ingredient,
  InstructionWithId,
  ScalableIngredient,
} from "../UtilClasses/Types";
import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import * as recipeClient from "../Clients/recipeClient";
import * as localRecipeClient from "../Clients/localRecipeClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import { useRouter, useSearchParams } from "next/navigation";
import { setTitle } from "../reducer";
import IngredientsEditor from "./IngredientsEditor";
import FlexGap from "../UtilClasses/FlexGap";
import { FaTrashAlt } from "react-icons/fa";

export default function Editor() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Recipe Editor"));
  }, [dispatch]);

  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.account);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: uuidv4(), ingredient: "", measure: "" },
  ]);
  const [scalableIngredients, setScalableIngredients] = useState<
    ScalableIngredient[]
  >([]);
  const [scalable, setScalable] = useState(false);
  const [instructions, setInstructions] = useState<InstructionWithId[]>([
    { id: uuidv4(), instruction: "" },
  ]);
  const [image, setImage] = useState("");
  const searchParams = useSearchParams();
  const localRecipeId = searchParams.get("localRecipe");
  const apiRecipeId = searchParams.get("apiRecipe");

  const fetchRecipe = async () => {
    if ((localRecipeId || apiRecipeId) && !(localRecipeId && apiRecipeId)) {
      const recipeIngredients: Ingredient[] = [];
      const recipeScalableIngredients: ScalableIngredient[] = [];
      const recipeInstructions: InstructionWithId[] = [];
      if (localRecipeId) {
        const localRecipe = await localRecipeClient.getRecipeById(
          localRecipeId
        );
        setRecipeTitle(localRecipe.recipeTitle);
        if (localRecipe.img) setImage(localRecipe.img);
        setScalable(localRecipe.scalable);
        if (localRecipe.scalable) {
          localRecipe.scalableIngredients?.forEach((ingredient) =>
            recipeScalableIngredients.push({ ...ingredient, id: uuidv4() })
          );
          setScalableIngredients(recipeScalableIngredients);
        } else {
          localRecipe.ingredients?.forEach((ingredient) =>
            recipeIngredients.push({ ...ingredient, id: uuidv4() })
          );
          setIngredients(recipeIngredients);
        }
        localRecipe.instructions?.forEach((instruction: string) =>
          recipeInstructions.push({ id: uuidv4(), instruction: instruction })
        );
      } else if (apiRecipeId) {
        const apiRecipe = await recipeClient.getRecipeById(apiRecipeId);
        if (!apiRecipe) return;
        setRecipeTitle(apiRecipe.strMeal);
        setImage(apiRecipe.strMealThumb);
        for (let i = 1; i < 21; i++) {
          const ingredient = apiRecipe[`strIngredient${i}`];
          const measurement = apiRecipe[`strMeasure${i}`];
          if (ingredient) {
            recipeIngredients.push({
              id: uuidv4(),
              ingredient: ingredient,
              measure: measurement ?? "",
            });
          }
        }
        setIngredients(recipeIngredients);
        const matchesStepPattern = (str: string) => /^step \d+$/.test(str);
        apiRecipe.strInstructions
          .split("\r\n")
          .filter(
            (instruction) =>
              instruction &&
              instruction !== "" &&
              !matchesStepPattern(instruction)
          )
          .forEach(
            (instruction: string) =>
              recipeInstructions.push({
                id: uuidv4(),
                instruction: instruction,
              })
          );
      }
      setInstructions(recipeInstructions);
    }
  };
  useEffect(() => {
    fetchRecipe();
  }, [localRecipeId, apiRecipeId]);

  const titleChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setRecipeTitle(e.target.value);
  const imageChanges = (e: ChangeEvent<HTMLInputElement>) =>
    setImage(e.target.value);

  const instructionChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    instructionIndex: number
  ) => {
    const updatedInstructions = instructions.map(
      (instruction, index) => {
        if (instructionIndex === index) {
          return { id: instruction.id, instruction: e.target.value };
        } else {
          return instruction;
        }
      }
    );
    setInstructions(updatedInstructions);
  };
  const addNewInstruction = () =>
    setInstructions([...instructions, { id: uuidv4(), instruction: "" }]);
  const deleteInstruction = (instructionIndex: number) =>
    setInstructions(
      instructions.filter((instruction, index) => instructionIndex !== index)
    );

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = uuidv4();
    await publishRecipe(id);
    router.push(`/details/${id}/local`);
  };

  const publishRecipe = async (newRecipeId: string) => {
    if (currentUser) {
      const author = { _id: currentUser._id, username: currentUser.username };
      await localRecipeClient.createRecipe({
        _id: newRecipeId,
        recipeTitle: recipeTitle,
        recipeAuthor: author,
        img: image !== "" ? image : undefined,
        datePosted: new Date(Date.now()),
        ingredients: ingredients.map((ingredient) => {
          return {
            ingredient: ingredient.ingredient,
            measure: ingredient.measure,
          };
        }),
        scalableIngredients: scalableIngredients.map((ingredient) => {
          return {
            ingredient: ingredient.ingredient,
            amount: ingredient.amount,
            unit: ingredient.unit,
          };
        }),
        scalable: scalable,
        instructions: instructions.map(
          (instruction) => instruction.instruction
        ),
      });
    }
  };

  return currentUser ? (
    currentUser.role !== "REVIEWER" ? (
      <div>
        <h1 className="mb-4">Create a new recipe</h1>
        <Form onSubmit={handleSubmit} className="mb-5">
          <FormGroup controlId="wdf-editor-title">
            <Card>
              <Card.Body className="d-block d-md-flex align-items-baseline gap-3">
                <FormLabel className="mb-0">
                  <Card.Title>Title</Card.Title>
                </FormLabel>
                <FormControl
                  type="text"
                  onChange={titleChanges}
                  placeholder="Give your recipe a title"
                  value={recipeTitle}
                  required
                />
              </Card.Body>
            </Card>
          </FormGroup>
          <FormGroup controlId="wdf-editor-image" className="mt-3">
            <Card>
              <Card.Body className="d-block d-md-flex align-items-center gap-3">
                <FormLabel className="mb-0">
                  <Card.Title>Image URL*</Card.Title>
                </FormLabel>
                <FormControl
                  type="text"
                  onChange={imageChanges}
                  placeholder="Upload a web URL with a picture of your recipe"
                  value={image}
                />
                <Card.Text className="mt-1">
                  *images will be resized to square
                </Card.Text>
              </Card.Body>
            </Card>
          </FormGroup>
          <Row>
            <Col lg={6} className="mt-3">
              <div className="wdf-editor-ingredients">
                <IngredientsEditor
                  scalable={scalable}
                  setScalable={setScalable}
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  scalableIngredients={scalableIngredients}
                  setScalableIngredients={setScalableIngredients}
                />
              </div>
            </Col>
            <Col lg={6} className="mt-3">
              <div className="wdf-editor-instructions">
                <Card>
                  <Card.Header className="mt-1 d-flex align-items-baseline">
                    <Card.Title>
                      <FormLabel>Instructions</FormLabel>
                    </Card.Title>
                    <FlexGap />
                    <Button onClick={addNewInstruction} className="ms-2">
                      +Instruction
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {instructions.map((instruction, index) => (
                      <FormGroup
                        key={instruction.id}
                        controlId={`wdf-editor-instruction-${index}`}
                      >
                        <Card
                          className={
                            index === instructions.length - 1 ? "" : "mb-3"
                          }
                        >
                          <Card.Header className="d-flex align-items-center pb-1">
                            <FormLabel className="m-0">
                              <Card.Title>Step {index + 1}</Card.Title>
                            </FormLabel>
                            <FlexGap />
                            <FaTrashAlt
                              className="wdf-cursor-pointer"
                              onClick={() => deleteInstruction(index)}
                            />
                          </Card.Header>
                          <Card.Body>
                            <FormControl
                              type="text"
                              as={"textarea"}
                              placeholder="Add instructions"
                              value={instruction.instruction}
                              onChange={(e) =>
                                instructionChanges(e, index)
                              }
                              required
                            />
                          </Card.Body>
                        </Card>
                      </FormGroup>
                    ))}
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
          <Button className="mt-3" type="submit">
            Publish Recipe
          </Button>
        </Form>
      </div>
    ) : (
      <div>
        <h1>Change your role to create a recipe</h1>
        <Button href="/settings">Go to Settings</Button>
      </div>
    )
  ) : (
    <h1>Sign in to create a recipe</h1>
  );
}

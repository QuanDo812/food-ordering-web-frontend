import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
  } from "@mui/material";
  import React, { useState } from "react";

  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import {categorizedIngredients} from "../../../util/categorizedIngredients"
import { addItemToCart } from "../../../state/Customer/Cart/Action";
import { useNavigate } from "react-router-dom";
  
  
  const MenuItemCard = ({menuItem}) => {
  
    const dispatch = useDispatch();
    const navigate = useNavigate()

  

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleCheckboxChange = (itemName) => {
    if (selectedIngredients.includes(itemName)) {
      console.log("yes");
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== itemName)
      );
    } else {
      console.log("no");
      setSelectedIngredients([...selectedIngredients, itemName]);
    }
  };

  const handleViewDetails = () =>{
      navigate(`/food/foodDetails/${menuItem.id}`)
  }
  
  const handleAddItemToCart = (e) => {
    e.preventDefault()
    
    const data = {
      token: localStorage.getItem("jwt"),
      cartItem: {
        foodId: menuItem?.id,
        quantity: 1,
        ingredients:selectedIngredients
      },
    };
    dispatch(addItemToCart(data));
  };
  
  
    
    
  
    return (
      <>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className="lg:flex items-center justify-between">
              <div className="lg:flex items-center lg:space-x-5">
                <img
                  className="w-[7rem] h-[7rem] object-cover"
                  src={"https://cdn.pixabay.com/photo/2014/09/17/20/26/restaurant-449952_1280.jpg"}
                  alt=""
                />
  
                <div className="space-y-1 lg:space-y-5 lg:max-w-2xl">
                  <p className="font-semibold text-xl">{menuItem?.name}</p>
                  <p>{menuItem?.price}</p>
                  <p className="text-gray-400">{menuItem?.description}</p>
                </div>
              </div>
              {/* <div>
          <Button onClick={handleAddItemToCart}>Add To Cart</Button>
        </div> */}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={handleAddItemToCart} >
            <div className="flex gap-5 flex-wrap">
               {Object.keys(
                          categorizedIngredients(menuItem?.ingredientsItems)
                        )?.map((category) => (
              <div className="pr-5">
                
                <p>{category}</p>
                <FormGroup >
                  {categorizedIngredients(menuItem?.ingredientsItems)[
                                category
                              ].map((ingredient, index) => (
                    <FormControlLabel
                      key={ingredient?.name}
                      control={
                        <Checkbox
                          checked={selectedIngredients.includes(
                            ingredient?.name
                          )}
                          onChange={() =>
                            handleCheckboxChange(ingredient.name)
                          }
                          disabled={!ingredient.inStoke}
                        />
                      }
                      label={ingredient.name}
                    />
                  ))}
                </FormGroup>
              </div>
            ))}
            </div>
             
                <div className="flex">
                <div className="pt-5">
              <Button variant="contained" disabled={!menuItem.available} type="submit">
                {menuItem.available?"Add To Cart":"Out of stock"}
              </Button>
              </div>
                <div className="pt-5 pl-10">
                <Button
                onClick={handleViewDetails}
  variant="outlined"
  sx={{ borderColor: "green", color: "green", borderWidth: 2 }}>
                  View Details
                </Button>

                </div>

                </div>
                          </form>

          </AccordionDetails>
        </Accordion>
      </>
    );
  };
  
  export default MenuItemCard;
  
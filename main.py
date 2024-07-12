import json
import pandas as pd

# Sample data
with open('test-knowyouronion.json', 'r') as f:
    data = json.load(f)

# Convert the list of dictionaries to a DataFrame
df = pd.DataFrame(data)

# Function to create the nested dictionary
def create_nested_dict(df):
    result = {}
    for state, state_df in df.groupby('state'):
        result[state] = {}
        for district, district_df in state_df.groupby('district'):
            result[state][district] = {}
            for market, market_df in district_df.groupby('market'):
                result[state][district][market] = {}
                for commodity, commodity_df in market_df.groupby('commodity'):
                    result[state][district][market][commodity] = commodity_df.to_dict(orient='records')
    return result

# Create the nested dictionary
nested_dict = create_nested_dict(df)

# Convert the dictionary to JSON
nested_json = json.dumps(nested_dict, indent=4)

# Write to a file
with open('nested_data.json', 'w') as f:
    f.write(nested_json)

print(nested_json)

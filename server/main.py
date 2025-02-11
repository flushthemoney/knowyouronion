import json
import pandas as pd

with open('test-knowyouronion.json', 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data)

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

nested_dict = create_nested_dict(df)
nested_json = json.dumps(nested_dict, indent=4)


with open('nested_data.json', 'w') as f:
    f.write(nested_json)

print(nested_json)
